// src/features/chat/api.ts

import { apiClient } from "@/lib/apiClient";
import type { ApiResponse, ChatMessage, ToolCall } from "./types";

export async function getChatHistory(): Promise<ChatMessage[]> {
  const res = await apiClient.get<ApiResponse<ChatMessage[]>>(
    "http://localhost:3000/api/chat/history"
  );

  return res.data.data;
}

type StreamHandlers = {
  onToken: (token: string) => void;
  onToolCall: (toolCall: ToolCall) => void;
  onDone: () => void;
};

export async function streamChatMessage(
  message: string,
  handlers: StreamHandlers
) {
  const res = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok || !res.body) {
    throw new Error("Failed to stream chat response");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      if (!event.startsWith("data: ")) continue;

      const json = event.replace("data: ", "");
      const parsed = JSON.parse(json);

      if (parsed.type === "token") {
        handlers.onToken(parsed.content);
      }

      if (parsed.type === "tool") {
        handlers.onToolCall(parsed.toolCall);
      }

      if (parsed.type === "done") {
        handlers.onDone();
      }
    }
  }
}