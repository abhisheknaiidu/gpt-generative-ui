import { InternetSource } from "@/app/types/sources";
import { queryAssistant } from "@/services/ai";
import { getTopicSources } from "@/services/search";
import { OPENAI_ASSISTANTS } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

type CarouselItem = {
  title: string;
  description: string[];
  imageGenerationPrompt: string;
  imageDimensions: "1024x1792" | "1792x1024" | "1024x1024" | "512x512";
};

export async function GET(req: NextRequest) {
  try {
    const topic = req.nextUrl.searchParams.get("topic");
    if (!topic) {
      return NextResponse.json({ sources: [] }, { status: 400 });
    }

    const sources = await getTopicSources(topic);

    const message = buildQuery(topic, sources);
    const response = await queryAssistant(
      OPENAI_ASSISTANTS.CAROUSEL_GENERATOR,
      message
    );

    let carouselData: CarouselItem[];
    try {
      carouselData = JSON.parse(response).data;
    } catch (e) {
      console.log("ERROR PARSING RESPONSE: ", response);
      throw e;
    }

    return NextResponse.json(carouselData, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ sources: [] }, { status: 500 });
  }
}

const buildQuery = (topic: string, sources: InternetSource[]) => {
  return `
    TOPIC: ${topic},
    DATA: ${JSON.stringify(sources, null, 2)}
  `;
};
