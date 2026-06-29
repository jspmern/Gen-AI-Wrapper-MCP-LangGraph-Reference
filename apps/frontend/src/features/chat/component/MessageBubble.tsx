// src/features/chat/components/MessageBubble.tsx

import type { ChatMessage } from "../types";

type Props = {
  message: ChatMessage;
};

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
          isUser
            ? "bg-slate-900 text-white"
            : "bg-white border text-slate-900"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.toolCalls.map((tool) => (
              <div
                key={tool.id}
                className="rounded border bg-slate-50 p-2 text-xs text-slate-700"
              >
                <p className="font-semibold">Tool: {tool.name}</p>
                <p>Status: {tool.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}