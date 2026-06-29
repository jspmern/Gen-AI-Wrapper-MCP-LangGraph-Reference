// src/features/chat/types.ts

export type ChatRole = "user" | "assistant";

export type ToolCall = {
  id: string;
  name: string;
  status: "pending" | "completed" | "failed";
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  toolCalls?: ToolCall[];
};

 