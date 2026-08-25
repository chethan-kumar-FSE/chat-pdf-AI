const PDFviewer = ({ fileUrl }: { fileUrl: string }) => {
  return (
    <div className="h-full w-full">
      <iframe
        src={`${fileUrl}#zoom=100`}
        className="h-full w-full"
        title="PDF Viewer"
      />{" "}
    </div>
  );
};

export default PDFviewer;
