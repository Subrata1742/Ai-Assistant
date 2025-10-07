"use client";

import { useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(null);

  async function handleNewChat() {
    const res = await fetch("/api/chat", { method: "POST" });
    const chat = await res.json();
    setActiveChat(chat.id);
  }

  return (
    <div className="flex h-screen">
      <ChatSidebar onSelectChat={setActiveChat} onNewChat={handleNewChat} />
      <div className="flex-1">
        {activeChat ? <ChatWindow chatId={activeChat} /> : <p className="p-4">Select or create a chat</p>}
      </div>
    </div>
  );
}
