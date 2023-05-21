import { Roboto_Slab } from "next/font/google";
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
};

const customFont = Roboto_Slab({
  subsets: ["latin"],
  display: "swap",
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={customFont.className}>{children}</body>
    </html>
  );
}

//todo
// 18297463873863682
