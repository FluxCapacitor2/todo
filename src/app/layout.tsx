import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Sidebar } from "@/components/global/Sidebar";
import { TrpcProvider } from "@/components/global/TrpcProvider";
import { getServerSession } from "next-auth";
import { ExtSession, authOptions } from "@/pages/api/auth/[...nextauth]";
import { InnerLayout } from "@/components/global/InnerLayout";
import { prisma } from "@/util/prisma";
import { FetchingIndicators } from "@/components/global/FetchingIndicators";

export const metadata = {
  title: {
    template: "%s | Todo App",
    default: "Todo App",
  },
  manifest: "/manifest.webmanifest",
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
        <TrpcProvider>
          <InnerLayout session={await getServerSession(authOptions)}>
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
          </InnerLayout>
        </TrpcProvider>
      </body>
    </html>
  );
}
