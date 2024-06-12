import { ChatDataType, ChatItem, ChatSource } from "@/app/types/chat";
import { InternetSource } from "@/app/types/sources";
import { queryAssistantV1, queryAssistantV2 } from "@/services/ai";
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

export async function POST(req: NextRequest) {
  try {
    const userAddress = req.headers.get("x-user-address");
    if (!userAddress) {
      return NextResponse.json(
        {
          error: "Missing user address in headers.",
        },
        { status: 400 }
      );
    }
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
    const data: {
      history: ChatItem[];
      message: string;
    } = await req.json();

    const history = data.history;
    const message = data.message;

    const decisionQuery = buildDecisionQuery(history, message);

    const [sources, flow] = await Promise.all([
      getTopicSources(message),
      queryAssistantV2(
        OPENAI_ASSISTANTS.DECISION_DRIVER,
        decisionQuery
      ) as Promise<ChatDataType>,
    ]);

    const responseQuery = buildTextMessageQuery(history, message, sources);

    let responseData;
    switch (flow) {
      case ChatDataType.TEXT_MESSAGE:
        responseData = await queryAssistantV2(
          OPENAI_ASSISTANTS.CHAT_TEXT_MESSAGE,
          responseQuery
        );
        break;
      case ChatDataType.COINS_LIST:
        responseData = await queryAssistantV1(
          OPENAI_ASSISTANTS.CHAT_COINS_LIST,
          responseQuery
        );
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          console.log("ERROR PARSING RESPONSE: ", responseData);
          throw e;
        }
        break;
      case ChatDataType.COIN_PRICE:
        responseData = await queryAssistantV1(
          OPENAI_ASSISTANTS.CHAT_COIN_PRICE,
          responseQuery
        );
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          console.log("ERROR PARSING RESPONSE: ", responseData);
          throw e;
        }
        break;
      case ChatDataType.DATA_LIST:
        responseData = await queryAssistantV1(
          OPENAI_ASSISTANTS.CHAT_DATA_LIST,
          responseQuery
        );
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          console.log("ERROR PARSING RESPONSE: ", responseData);
          throw e;
        }
        break;
      default:
        // Use text as fallback
        responseData = await queryAssistantV2(
          OPENAI_ASSISTANTS.CHAT_TEXT_MESSAGE,
          responseQuery
        );
    }

    const chatItem: ChatItem = {
      source: ChatSource.WAGMI_AI,
      type: flow,
      data: responseData,
    };
    await updateUserCredits(userAddress, 1);
    return NextResponse.json(chatItem, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ sources: [] }, { status: 500 });
  }
}

const buildDecisionQuery = (history: ChatItem[], message: string) => {
  return `
    HISTORY: ${JSON.stringify(history, null, 2)},
    USER QUERY: ${message}
  `;
};

const buildTextMessageQuery = (
  history: ChatItem[],
  message: string,
  sources: InternetSource[]
) => {
  return `
    HISTORY: ${JSON.stringify(history, null, 2)},
    GOOGLE SEARCH DATA: ${JSON.stringify(sources, null, 2)}
    USER QUERY: ${message},
  `;
};
