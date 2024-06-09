import { InternetSource } from "@/app/types/sources";
import { queryAssistantV1 } from "@/services/ai";
import { getTopicSources } from "@/services/search";
import { getUserWithInitialization, updateUserCredits } from "@/services/users";
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
    // TODO: get user's address from headers
    const userAddress = "0x1234567890abcdef1234567890abcdef12345678";
    const userData = await getUserWithInitialization(userAddress);
    if (userData.credits < 1) {
      return NextResponse.json(
        {
          error:
            "Insufficient credits. Please purchase more credits using BONK tokens.",
        },
        { status: 402 }
      );
    }
    const topic = req.nextUrl.searchParams.get("topic");
    if (!topic) {
      return NextResponse.json(
        {
          error: "Missing topic parameter in query string.",
        },
        { status: 400 }
      );
    }

    const sources = await getTopicSources(topic);

    const message = buildQuery(topic, sources);
    const response = await queryAssistantV1(
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

    await updateUserCredits(userAddress, 1);
    return NextResponse.json(carouselData, { status: 200 });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      {
        error: err.message || "An error occurred while processing the request.",
      },
      { status: 500 }
    );
  }
}

const buildQuery = (topic: string, sources: InternetSource[]) => {
  return `
    TOPIC: ${topic},
    DATA: ${JSON.stringify(sources, null, 2)}
  `;
};
