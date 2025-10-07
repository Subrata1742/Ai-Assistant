"use client";

import { useState, useEffect, useCallback } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [chats, setChats] = useState([]);

  // ✅ Memoize fetchChats to make it a stable dependency
  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chat/list");
      if (!res.ok) {
        throw new Error("Failed to fetch chats");
      }
      const data = await res.json();
      setChats(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Fetch the initial chat list only once when the component mounts
  useEffect(() => {
    fetchChats();
  }, []);

  async function handleNewChat() {
    const res = await fetch("/api/chat", { method: "POST" });
    const newChat = await res.json();
    await fetchChats(); // Refresh the list
    setActiveChatId(newChat.id); // Set the new chat as active
  }

  // ✅ This function is called by ChatWindow to refresh the sidebar
  const handleTitleUpdate =() => {
    fetchChats();
  };

  return (
    <div className="flex h-screen">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        
      />
      <div className="flex-1">
        {activeChatId ? (
          <ChatWindow
            key={activeChatId}
            chatId={activeChatId}
            onTitleUpdate={handleTitleUpdate}
            onNewChat={handleNewChat}
          />
        ) : (
          <div className="p-4 h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Select or create a new chat to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}