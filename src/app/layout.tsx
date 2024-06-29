"use client";
import Header from "@/components/Header";
import { Instrument_Sans, Space_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import WalletContextProvider from "./components/WalletContextProvider";
import { CookiesProvider } from "react-cookie";
import { Onest } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"] });
const instrumentSans = Instrument_Sans({ subsets: ["latin"] });
const onest = Onest({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Wagmi Quest: Engage with Intuitive AI and Generative UI",
//   description:
//     "Discover a Smarter Way To Learn and Find Information With Our AI-Driven Platform. It Not Only Provides Detailed Insights but Also Creates Interactive UI Components On-the-Fly",
//   robots: "index, follow",
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     url: "https://www.wagmi.quest",
//     title: "Wagmi Quest: Engage with Generative UI",
//     siteName: "Wagmi Quest",
//     description:
//       "Discover a Smarter Way To Learn and Find Information With Our AI-Driven Platform. It Not Only Provides Detailed Insights but Also Creates Interactive UI Components On-the-Fly",
//     images: [
//       {
//         url: "/og.png",
//         width: 1200,
//         height: 630,
//         alt: "Wagmi Quest: Engage with Intuitive AI and Generative UI",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     images: [
//       {
//         url: "/og.png",
//         width: 1200,
//         height: 630,
//         alt: "Wagmi Quest: Engage with Intuitive AI and Generative UI",
//       },
//     ],
//   },
//   keywords:
//     "generative UI, generative ai, smart chat, bonkathon, ai char, ai component genration, ai, wagmi, wagmi quest, wagmi quest ai, wagmi quest generative ui, ai driven platform, ai driven generative ui",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="wagmi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FDDE00" />
        <link rel="icon" href="/favicon.svg" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta
          name="apple-mobile-web-app-title"
          content="Wagmi Quest: Engage with Intuitive AI and Generative UI"
        />
        <meta
          name="title"
          content="Engage with Intuitive AI and Generative UI"
        />
        <meta
          name="description"
          content="Discover a Smarter Way To Learn and Find Information With Our AI-Driven Platform. It Not Only Provides Detailed Insights but Also Creates Interactive UI Components On-the-Fly"
        />
        <meta
          name="keywords"
          content="generative UI, generative ai, smart chat, bonkathon, ai char, ai component genration, ai"
        />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />

        {/* og */}
        <meta property="og:url" content="https://www.wagmi.quest" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.wagmi.quest/" />
        <meta property="og:title" content="Wagmi Quest: Engage with Intuitive AI and Generative UI" />
        <meta property="og:description" content="Discover a Smarter Way To Learn and Find Information With Our AI-Driven Platform. It Not Only Provides Detailed Insights but Also Creates Interactive UI Components On-the-Fly" />
        <meta property="og:image" content="https://www.wagmi.quest/og.png" />

        {/* twitter */}
        {/* <meta name="twitter:image" content="/og.p ng" itemType="image/png" />
        <meta name="twitter:image:src" content="/og.png" itemType="image/png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.wagmi.quest/" />
        <meta property="twitter:title" content="Wagmi Quest: Engage with Intuitive AI and Generative UI" />
        <meta property="twitter:description" content="Discover a Smarter Way To Learn and Find Information With Our AI-Driven Platform. It Not Only Provides Detailed Insights but Also Creates Interactive UI Components On-the-Fly" />
        <meta property="twitter:image" content="/og.png" itemType="image/png" /> */}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Wagmi Quest: Engage with Intuitive AI and Generative UI">
        <meta name="twitter:description" content="Discover a Smarter Way To Learn and Find Information With Our AI-Driven Platform. It Not Only Provides Detailed Insights but Also Creates Interactive UI Components On-the-Fly">
        <meta name="twitter:image" content="http://graphics8.nytimes.com/images/2012/02/19/us/19whitney-span/19whitney-span-articleLarge.jpg">

        <title>Wagmi Quest: Engage with Intuitive AI and Generative UI</title>
      </head>
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
      <body className={onest.className}>
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
