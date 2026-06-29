// src/features/chat/components/ChatInput.tsx

"use client";

import { useState } from "react";

type Props = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export default function ChatInput({ onSend, disabled }: Props) {
  const [message, setMessage] = useState("");

  function handleSend() {
    if (!message.trim()) return;

    onSend(message);
    setMessage("");
  }

  return (
    <div className="border-t bg-white p-4">
      <div className="flex gap-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          disabled={disabled}
          placeholder="Ask AI something..."
          className="flex-1 rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-gray-100"
        />

        <button
          onClick={handleSend}
          disabled={disabled}
          className="rounded-lg bg-slate-900 px-5 py-3 text-white disabled:opacity-50"
        >
          {disabled ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}