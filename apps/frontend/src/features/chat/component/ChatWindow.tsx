// src/features/chat/components/ChatWindow.tsx

"use client";

import { useEffect } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { useChatHistory, useChatStream } from "../hooks";

export default function ChatWindow() {
  const { data: history, isLoading } = useChatHistory();
  const { messages, setMessages, sendMessage, isStreaming } = useChatStream();

  useEffect(() => {
    if (history) {
      setMessages(history);
    }
  }, [history, setMessages]);

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col overflow-hidden rounded-xl border bg-gray-50 shadow-sm">
     

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {isLoading && <p className="text-sm text-gray-500">Loading chat...</p>}

        {!isLoading && messages.length === 0 && (
          <div className="text-center text-gray-500">
            Start your first AI conversation.
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isStreaming && (
          <p className="text-sm text-gray-400">AI is typing...</p>
        )}
      </div>

      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  );
}