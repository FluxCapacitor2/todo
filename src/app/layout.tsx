import { FetchingIndicators } from "@/components/global/FetchingIndicators";
import { InnerLayout } from "@/components/global/InnerLayout";
import { Sidebar } from "@/components/global/Sidebar";
import { TrpcProvider } from "@/components/global/TrpcProvider";
import { ExtSession, authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/util/prisma";
import { getServerSession } from "next-auth";
import { Toaster } from "react-hot-toast";
import "./globals.css";

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
      <body className="ui-focus-visible:overflow-hidden">
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
              <div className="mt-3 w-full">{children}</div>
              <FetchingIndicators />
            </div>
            <Toaster position="top-right" />
          </InnerLayout>
        </TrpcProvider>
      </body>
    </html>
  );
}
