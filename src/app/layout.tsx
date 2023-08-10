import { ThemeProvider } from "@/components/global/ThemeProvider";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: {
    template: "%s | Todo App",
    default: "Todo App",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
  },
  themeColor: "#22c55e",
  icons: [
    {
      url: "/icon.png",
      type: "image/png",
      sizes: "512x512",
    },
    {
      url: "/icons/icon_x48.png",
      type: "image/png",
      sizes: "48x48",
    },
    {
      url: "/icons/icon_x72.png",
      type: "image/png",
      sizes: "72x72",
    },
    {
      url: "/icons/icon_x96.png",
      type: "image/png",
      sizes: "96x96",
    },
    {
      url: "/icons/icon_x128.png",
      type: "image/png",
      sizes: "128x128",
    },
    {
      url: "/icons/icon_x192.png",
      type: "image/png",
      sizes: "192x192",
    },
    {
      url: "/icons/icon_x384.png",
      type: "image/png",
      sizes: "384x384",
    },
    {
      url: "/icons/icon_x512.png",
      type: "image/png",
      sizes: "512x512",
    },
  ],
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
