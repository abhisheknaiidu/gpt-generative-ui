"use client";

import { type CoreMessage } from "ai";
import { readStreamableValue } from "ai/rsc";
import endent from "endent";
import { useState } from "react";
import { continueConversation } from "../actions";

type Source = {
  url: string;
  text: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState("");
  const [data, setData] = useState<any>();
  const [userMessage, setUserMessage] = useState("");

  const fetchSources = async () => {
    const response = await fetch("/api/sources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: input }),
    });
    if (!response.ok) {
      // setLoading(false);
      throw new Error(response.statusText);
    }

    const { sources }: { sources: Source[] } = await response.json();

    return sources;
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {messages.map((m, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.role === "user" ? userMessage : (m.content as string)}
        </div>
      ))}

      <form
        action={async () => {
          const sources = await fetchSources();
          const prompt = endent`Provide a 2-3 sentence answer to the query based on the following sources. Be original, concise, accurate, and helpful. Cite sources as [1] or [2] or [3] after each sentence (not just the very end) to back up your answer (Ex: Correct: [1], Correct: [2][3], Incorrect: [1, 2]).
      
      ${sources
        .map((source, idx) => `Source [${idx + 1}]:\n${source.text}`)
        .join("\n\n")}
      `;
          const newMessages: CoreMessage[] = [
            ...messages,
            { content: prompt, role: "user" },
          ];

          setMessages(newMessages);
          setInput("");

          const result = await continueConversation(newMessages);
          setData(result.data);

          for await (const content of readStreamableValue(result.message)) {
            setMessages([
              ...newMessages,
              {
                role: "assistant",
                content: content as string,
              },
            ]);
          }
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded text-black shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={(e) => {
            setInput(e.target.value);
            setUserMessage(e.target.value);
          }}
        />
      </form>
    </div>
  );
}
