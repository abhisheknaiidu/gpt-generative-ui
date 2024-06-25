"use client";
import Header from "@/components/Header";
import { Instrument_Sans, Space_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import WalletContextProvider from "./components/WalletContextProvider";
import { CookiesProvider } from "react-cookie";

import "./globals.css";
import { Metadata } from "next";
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wagmi Quest: Engage with Intuitive AI and Generative UI",
  description:
    "Discover a Smarter Way To Learn and Find Information With Our AI-Driven Platform. It Not Only Provides Detailed Insights but Also Creates Interactive UI Components On-the-Fly",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.wagmi.quest",
    title: "Wagmi Quest: Engage with Generative UI",
    siteName: "Wagmi Quest",
    description:
      "Discover a Smarter Way To Learn and Find Information With Our AI-Driven Platform. It Not Only Provides Detailed Insights but Also Creates Interactive UI Components On-the-Fly",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Wagmi Quest: Engage with Intuitive AI and Generative UI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Wagmi Quest: Engage with Intuitive AI and Generative UI",
      },
    ],
  },
  keywords:
    "generative UI, generative ai, smart chat, bonkathon, ai char, ai component genration, ai, wagmi, wagmi quest, wagmi quest ai, wagmi quest generative ui, ai driven platform, ai driven generative ui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="wagmi">
      {
        // .in-s {
        //   font-family: ${instrumentSans.style.fontFamily};
        //   font-style: ${instrumentSans.style.fontStyle};
        // }
      }
      <style>{`
        .sp-m {
          font-family: ${spaceMono.style.fontFamily};
          font-weight: ${spaceMono.style.fontWeight};
        }
      `}</style>
      <body className={spaceMono.className}>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <Toaster />
          <WalletContextProvider>
            {children}
            <Header />
          </WalletContextProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}
