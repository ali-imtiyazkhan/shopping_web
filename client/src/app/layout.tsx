import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/toaster";
import CommonLayout from "../components/common/layout";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "VOREN | Premium Minimalist Menswear",
  description: "High-end, luxury menswear designed with a minimalist aesthetic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${cormorant.variable} ${jost.variable} font-jost antialiased bg-background text-foreground`}
      >
        <CommonLayout>{children}</CommonLayout>
        <Toaster />
      </body>
    </html>
  );
}
