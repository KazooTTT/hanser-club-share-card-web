import FullPageBackground from "@/components/FullPageBackground";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mgclub Share Card",
  description: "input mgclub post url, output the long pic to share.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <>
          <main>{children}</main>
        </>
      </body>
    </html>
  );
}
