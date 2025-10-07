"use client";

import { useState, useEffect, useCallback } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [chats, setChats] = useState([]);

  // ✅ Memoize fetchChats to prevent re-creating it on every render
  const fetchChats = useCallback(async () => {
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
  }, []);

  // Fetch the initial chat list when the component mounts
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  async function handleNewChat() {
    const res = await fetch("/api/chat", { method: "POST" });
    const newChat = await res.json();
    await fetchChats(); // Refresh the list
    setActiveChatId(newChat.id);
  }

  // ✅ This function is called by ChatWindow to refresh the sidebar
  const handleTitleUpdate = useCallback(() => {
    // Add a small delay to give the server time to generate and save the title
    setTimeout(() => {
      fetchChats();
    }, 100); // 100 milliseconds is enough
  }, [fetchChats]);

  return (
    <div className="flex h-screen">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
      />
      <div className="flex-1">
        {activeChatId ? (
          <ChatWindow
            key={activeChatId}
            chatId={activeChatId}
            onTitleUpdate={handleTitleUpdate}
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