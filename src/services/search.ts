import { InternetSource, InternetSourceV2 } from "@/app/types/sources";
import { GOOGLE_ACCOUNT_CX, GOOGLE_API_KEY } from "@/utils/constants";
import { Readability } from "@mozilla/readability";
import axios from "axios";
import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";

const cleanSourceText = (text: string) => {
  return text
    .trim()
    .replace(/(\n){4,}/g, "\n\n\n")
    .replace(/\n\n/g, " ")
    .replace(/ {3,}/g, "  ")
    .replace(/\t/g, "")
    .replace(/\n+(\s*\n)*/g, "\n");
};

export const getTopicSources = async (
  topic: string,
  count: number = 4
): Promise<InternetSource[]> => {
  const response = await fetch(`https://www.google.com/search?q=${topic}`);
  const html = await response.text();
  const $ = cheerio.load(html);
  const linkTags = $("a");

  let links: string[] = [];

  linkTags.each((i, link) => {
    const href = $(link).attr("href");

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

  const finalLinks = filteredLinks.slice(0, count);

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
  )) as InternetSource[];

  const filteredSources = sources.filter((source) => source !== undefined);

  for (const source of filteredSources) {
    source.text = source.text.slice(0, 1500);
  }

  return filteredSources;
};

export const getTopicSourcesV2 = async (
  topic: string
): Promise<InternetSourceV2[]> => {
  console.time("getTopicSourcesV2");
  const response = await axios.get(
    "https://www.googleapis.com/customsearch/v1",
    {
      params: {
        q: topic,
        key: GOOGLE_API_KEY,
        cx: GOOGLE_ACCOUNT_CX,
      },
    }
  );

  const result = response.data.items?.map((item: any) => {
    return {
      url: item.link,
      title: item.title,
      content: item.snippet,
    };
  });
  console.timeEnd("getTopicSourcesV2");
  return result;
};
