import { InnerLayout } from "@/components/global/InnerLayout";
import { Sidebar } from "@/components/global/Sidebar";
import { TrpcProvider } from "@/components/global/TrpcProvider";
import { ExtSession, authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { RouteAttribute } from "./[view]/[id]/RouteAttribute";

export default async function SignedInLayout({
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
        <div className="conditional-overflow-hidden flex flex-col md:flex-row">
          <Sidebar />
          <div className="conditional-overflow-hidden h-screen w-full pt-3">
            {children}
          </div>
          <Toaster position="top-right" />
        </div>
      </TrpcProvider>
      <RouteAttribute />
    </InnerLayout>
  );
}
