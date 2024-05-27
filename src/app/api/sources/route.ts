import { NextRequest, NextResponse } from "next/server";
import { Readability } from "@mozilla/readability";
import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";

type Data = {
  sources: Source[];
};

type Source = {
  url: string;
  text: string;
};

export enum OpenAIModel {
  DAVINCI_TURBO = "gpt-4-turbo",
}

const cleanSourceText = (text: string) => {
  return text
    .trim()
    .replace(/(\n){4,}/g, "\n\n\n")
    .replace(/\n\n/g, " ")
    .replace(/ {3,}/g, "  ")
    .replace(/\t/g, "")
    .replace(/\n+(\s*\n)*/g, "\n");
};

export async function POST(req: NextRequest) {
  try {
    const { query, model } = (await req.json()) as {
      query: string;
      model: OpenAIModel;
    };

    const sourceCount = 4;

    console.log("query", query);

    // GET LINKS
    const response = await fetch(`https://www.google.com/search?q=${query}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    const linkTags = $("a");

    let links: string[] = [];

    linkTags.each((i, link) => {
      const href = $(link).attr("href");
      console.log("href<<<<<", href);

      if (href && href.startsWith("/url?q=")) {
        const cleanedHref = decodeURIComponent(
          href.replace("/url?q=", "").split("&")[0]
        );

        if (
          !links.includes(cleanedHref) &&
          (cleanedHref.startsWith("http://") ||
            cleanedHref.startsWith("https://"))
        ) {
          links.push(cleanedHref);
        }
      }
    });

    const filteredLinks = links.filter((link, idx) => {
      try {
        const domain = new URL(link).hostname;

        const excludeList = [
          "google",
          "facebook",
          "twitter",
          "instagram",
          "youtube",
          "tiktok",
        ];
        if (excludeList.some((site) => domain.includes(site))) return false;

        return (
          links.findIndex((link) => new URL(link).hostname === domain) === idx
        );
      } catch (err) {
        console.error(`Invalid URL: ${link}`, err);
        return false;
      }
    });

    const finalLinks = filteredLinks.slice(0, sourceCount);

    // SCRAPE TEXT FROM LINKS
    const sources = (await Promise.all(
      finalLinks.map(async (link) => {
        try {
          const response = await fetch(link);
          const html = await response.text();
          const dom = new JSDOM(html);
          const doc = dom.window.document;
          const parsed = new Readability(doc).parse();

          if (parsed) {
            let sourceText = cleanSourceText(parsed.textContent);

            return { url: link, text: sourceText };
          }
        } catch (err) {
          console.error(`Error fetching or parsing URL: ${link}`, err);
          return undefined;
        }
      })
    )) as Source[];

    const filteredSources = sources.filter((source) => source !== undefined);

    for (const source of filteredSources) {
      source.text = source.text.slice(0, 1500);
    }

    return NextResponse.json({ sources: filteredSources }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ sources: [] }, { status: 500 });
  }
}
