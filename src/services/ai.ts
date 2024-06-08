import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API key in environment variables.");
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const createThread = async (message: string) => {
  return await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });
};

const runThread = async (threadId: string, assistantId: string) => {
  await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistantId,
  });
};

const extractTextFromResponse = (messages: any): string | undefined => {
  if (messages.data.length === 0 || !messages.data[0].content.length) {
    console.warn("No messages found in the thread.");
    return;
  }

  const response = messages.data[0].content[0] as { text: { value: string } };

  return response?.text?.value;
};

export const queryAssistant = async (assistantId: string, message: string) => {
  const thread = await createThread(message);
  await runThread(thread.id, assistantId);
  const messages = await openai.beta.threads.messages.list(thread.id);
  const text = extractTextFromResponse(messages);

  if (!text) {
    console.warn("NO CONTENT IN THREAD: ", thread.id);
    throw new Error("Unable to generate data from assistant.");
  }

  return text;
};
