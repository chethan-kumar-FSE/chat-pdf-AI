import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getEmbeddings } from "./embedding";
import md5 from "md5";
import { convertToAscii } from "./utils";

// Load pdf-parse using require to handle CommonJS export
// Replace: const pdfParse = require("pdf-parse");
// With this:
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export async function getPineconeIndex() {
  const indexModel = await pinecone.describeIndex(
    process.env.PINECONE_INDEX_NAME!,
  );
  return pinecone.index({ host: indexModel.host });
}

export async function loadS3IntoPinecone(fileKey: string) {
  // 1. Download PDF from S3
  const pdfBlob = await downloadFromS3(fileKey);

  if (!pdfBlob) {
    throw new Error("Could not download PDF from S3");
  }

  // 2. Convert Blob to Buffer for Node environment
  const arrayBuffer = await pdfBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 3. Extract text using pdf-parse
  const data = await pdfParse(buffer);

  if (!data || !data.text) {
    throw new Error("Failed to extract text from PDF");
  }

  console.log(`Successfully extracted ${data.numpages} pages from PDF.`);

  // 4. Structure payload to match your schema and prepare document chunks
  const pdfPayload = {
    pages: {
      numpages: data.numpages,
      numrender: data.numrender,
      info: data.info,
      metadata: data.metadata,
      text: data.text,
      version: data.version,
    },
  };

  // 5. Clean, sanitize, and split text into chunked LangChain Documents
  const docs = await prepareDocument(pdfPayload, fileKey);

  console.log(`Generated ${docs.length} document chunks for Pinecone.`);
  console.log("docs", docs);

  // Return the chunked documents (ready to be embedded & upserted)
  const vectors = await Promise.all(
    docs.flat().map((doc) => embededDocument(doc)),
  );

  const index = await getPineconeIndex();

  const namespace = convertToAscii(fileKey);

  await index.namespace(namespace).upsert({ records: vectors });

  return docs[0];
}

async function embededDocument(doc: any) {
  try {
    const embedding = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embedding,
      metadata: {
        text: doc.pageContent,
        pageNumber: doc.metadata.totalPages,
      },
    };
  } catch (err) {
    console.log("err");
    throw err;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

// Interface matching your exact JSON structure
interface PDFParseData {
  pages: {
    numpages: number;
    text: string;
    info?: {
      Author?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

export async function prepareDocument(data: PDFParseData, fileKey: string) {
  // Extract directly from your object structure
  const { text, numpages } = data.pages;

  // 1. Clean formatting while keeping word spaces intact
  const pageContent = text
    .replace(/[^\x00-\x7F]/g, " ") // Strip non-ASCII characters
    .replace(/\r\n/g, "\n") // Standardize line breaks
    .replace(/\n\s*\n+/g, "\n\n") // Collapse multi-line gaps into clean paragraphs
    .trim();

  // 2. Configure text splitter
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  // 3. Split the text document
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        fileKey: fileKey,
        totalPages: numpages,
        text: truncateStringByBytes(pageContent, 10000), // Safe size for Pinecone metadata
      },
    }),
  ]);

  return docs;
}
