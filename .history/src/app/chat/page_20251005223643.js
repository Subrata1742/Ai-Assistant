"use client";

import { useState, useEffect } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [chats, setChats] = useState([]); // ✅ State to hold the list of chats

  // ✅ Function to fetch/refresh the chat list from the server
  const fetchChats = async () => {
    const res = await fetch("/api/chat/list");
    const data = await res.json();
    setChats(data);
  };

  // ✅ Fetch the initial chat list when the component first loads
   useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  async function handleNewChat() {
    const res = await fetch("/api/chat", { method: "POST" });
    const newChat = await res.json();
    fetchChats(); // ✅ Refresh the chat list to include the new one
    setActiveChatId(newChat.id); // Set the new chat as active
  }

  // ✅ This function is called by ChatWindow when a title is generated
  function handleTitleUpdate(chatId, newTitle) {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat,
      ),
    );
  }

  return (
    <div className="flex h-screen">
      <ChatSidebar
        chats={chats} // ✅ Pass the full list of chats
        activeChatId={activeChatId} // Pass the active chat ID for styling
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        
      />
      <div className="flex-1">
        {activeChatId ? (
          <ChatWindow
            key={activeChatId} // ✅ Add key to force re-mount on chat change
            chatId={activeChatId}
            onTitleUpdate={handleTitleUpdate} // ✅ Pass the update function
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