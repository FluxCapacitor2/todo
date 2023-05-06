import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { TrpcProvider } from "@/components/TrpcProvider";
import { getServerSession } from "next-auth";
import { ExtSession, authOptions } from "@/pages/api/auth/[...nextauth]";
import { InnerLayout } from "@/components/InnerLayout";
import { prisma } from "@/util/prisma";
import { FetchingIndicators } from "@/components/FetchingIndicators";

export const metadata = {
  title: "Todo App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await getServerSession(authOptions)) as ExtSession;
  return (
    <html lang="en">
      <body>
        <InnerLayout session={await getServerSession(authOptions)}>
          <TrpcProvider>
            <div className="flex">
              {session !== null && (
                <Sidebar
                  initialData={await prisma.project.findMany({
                    where: { ownerId: session.id },
                  })}
                />
              )}
              <div className="w-full">{children}</div>
              <FetchingIndicators />
            </div>
            <Toaster position="top-right" />
          </TrpcProvider>
        </InnerLayout>
      </body>
    </html>
  );
}
