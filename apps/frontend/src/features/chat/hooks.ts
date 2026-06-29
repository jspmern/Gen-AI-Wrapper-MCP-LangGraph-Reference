// src/features/chat/hooks.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getChatHistory, streamChatMessage } from "./api";
import type { ChatMessage, ToolCall } from "./types";
import { getErrorMessage } from "@/lib/error";

export function useChatHistory() {
  return useQuery({
    queryKey: ["chat-history"],
    queryFn: getChatHistory,
  });
}

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  async function sendMessage(message: string) {
    try {
      if (!message.trim()) return;

      setIsStreaming(true);

      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        role: "user",
        content: message,
        createdAt: new Date().toISOString(),
      };

      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        toolCalls: [],
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);

      await streamChatMessage(message, {
        onToken: (token) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? {
                    ...msg,
                    content: msg.content + token,
                  }
                : msg
            )
          );
        },

        onToolCall: (toolCall: ToolCall) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? {
                    ...msg,
                    toolCalls: [...(msg.toolCalls || []), toolCall],
                  }
                : msg
            )
          );
        },

        onDone: () => {
          setIsStreaming(false);
        },
      });
    } catch (error) {
      setIsStreaming(false);
      toast.error(getErrorMessage(error));
    }
  }

  return {
    messages,
    setMessages,
    sendMessage,
    isStreaming,
  };
}