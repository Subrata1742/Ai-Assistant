"use client";

import { useState, useEffect, useCallback } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [loadChat, setloadChat] = useState(false);

  // fetch Chats
  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chat/list");
      if (!res.ok) {
        throw new Error("Failed to fetch chats");
      }
      const data = await res.json();
      setChats(data);
      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setloadChat(true);
    }
  };

  async function handleNewChat() {
    //Delete if empty
    const currentChats = await fetchChats();

    const emptyChats = currentChats.filter((chat) => !chat.title);

    if (emptyChats.length > 0) {
      const deletePromises = emptyChats.map((chat) =>
        fetch(`/api/chat/${chat.id}`, { method: "DELETE" })
      );

      await Promise.all(deletePromises);
    }
    //Create new chat
    const res = await fetch("/api/chat", { method: "POST" });
    const newChat = await res.json();
    await fetchChats();
    setActiveChatId(newChat.id);
  }
  useEffect(() => {
    handleNewChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTitleUpdate = () => {
    fetchChats();
  };
  //Delete chat
  const handleDeleteChat = async (chatId) => {
    // Ask for confirmation
    if (!confirm("Are you sure you want to delete this chat?")) {
      return;
    }

    try {
      const res = await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));

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
    <SidebarProvider >
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        handleDeleteChat={handleDeleteChat}
      />
      <main  className="w-full ">
       <div className="text-black"> trigger<SidebarTrigger/></div> 
        {activeChatId ? (
          <ChatWindow
            key={activeChatId}
            chatId={activeChatId}
            onTitleUpdate={handleTitleUpdate}
          />
        ) : (
          <div className="p-4 h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">
              Select or create a new chat to begin.
            </p>
          </div>
        )}
      </main>
    </SidebarProvider>
  );
}
