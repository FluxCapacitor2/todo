import { FetchingIndicators } from "@/components/global/FetchingIndicators";
import { InnerLayout } from "@/components/global/InnerLayout";
import { Sidebar } from "@/components/global/Sidebar";
import { TrpcProvider } from "@/components/global/TrpcProvider";
import { ExtSession, authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await getServerSession(authOptions)) as ExtSession;

  if (!session?.user) {
    redirect("/signed-out");
  }

  return (
    <InnerLayout session={session}>
      <TrpcProvider>
        <div className="flex">
          {session !== null && <Sidebar />}
          <div className="mt-3 w-full">{children}</div>
          <FetchingIndicators />
        </div>
        <Toaster position="top-right" />
      </TrpcProvider>
    </InnerLayout>
  );
}
