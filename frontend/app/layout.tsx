import type { Metadata } from "next";
import { Inter, Geist_Mono, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  weight: "700",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OITOON",
  description: "An application for sharing and discovering comics, stories, and fanfiction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${robotoMono.variable} h-full antialiased`}
      style={{
        backgroundColor: "#0d0b1a",
        color: "#e0e0e0",
      }}
    >
      <body className={`${inter.className} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
