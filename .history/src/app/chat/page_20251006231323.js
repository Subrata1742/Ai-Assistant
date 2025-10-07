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
     if (activeChatId) {
      const activeChat = chats.find((c) => c.id === activeChatId);
      
      // Heuristic: an untitled chat is likely new and unused.
      // We also fetch its details to confirm it has zero messages.
      if (activeChat && !activeChat.title) {
        const res = await fetch(`/api/chat/${activeChatId}`);
        if (res.ok) {
          const chatDetails = await res.json();
          if (chatDetails.messages.length === 0) {
            // Silently delete the empty chat from the database
            await fetch(`/api/chat/${activeChatId}`, {
              method: "DELETE",
            });
          }
        }
      }
    }
    const res = await fetch("/api/chat", { method: "POST" });
    const newChat = await res.json();
    await fetchChats(); // Refresh the list
    setActiveChatId(newChat.id); // Set the new chat as active
    
  }

  // ✅ This function is called by ChatWindow to refresh the sidebar
  const handleTitleUpdate =() => {
    fetchChats();
  };
   const handleDeleteChat = async (chatId) => {
    // Optional: Ask for confirmation
    if (!confirm("Are you sure you want to delete this chat?")) {
      return;
    }

    try {
      const res = await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove the chat from the local state
        setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));

        // If the deleted chat was the active one, clear the window
        if (activeChatId === chatId) {
          setActiveChatId(null);
        }
      } else {
        console.error("Failed to delete chat");
      }
    } catch (error) {
      console.error("An error occurred while deleting the chat:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
         handleDeleteChat={ handleDeleteChat}
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