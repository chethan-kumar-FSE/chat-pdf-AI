import { Button } from "@/components/ui/button";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { LogInIcon } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import UpgradeButton from "../components/UpgradeButton";
import { checkSubscription } from "@/lib/subscription";

export default async function Home() {
  const { userId } = await auth();
  const isUserLoggedIn = !!userId;
  const isSubscribed = await checkSubscription();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <p className="text-red-300">hellow rold</p>
      <Button>click me</Button>
      {!isSubscribed && <UpgradeButton />}
      {isUserLoggedIn && <Button>Go to chats</Button>}
      {isUserLoggedIn ? (
        <FileUpload />
      ) : (
        <Link href={"/sign-in"}>
          <Button>
            Login to get started <LogInIcon />
          </Button>
        </Link>
      )}
    </div>
  );
}
