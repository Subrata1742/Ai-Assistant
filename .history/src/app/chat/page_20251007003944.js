"use client";

import { useState, useEffect, useCallback } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [loadChat, setloadChat] = useState(false);
  

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
    }finally{
      setloadChat(true);
    }
  };

  
  //  useEffect(() => {
    
  //       fetchChats();
  
 
  // }, []);

  // ✅ Fetch the initial chat list only once when the component mounts
   
  const handleNewChat = useCallback(async () => {
    // 1. Create the new chat FIRST. This is the primary action.
    const createRes = await fetch("/api/chat", { method: "POST" });
    if (!createRes.ok) {
      console.error("Failed to create a new chat.");
      return;
    }
    const newChat = await createRes.json();

    // 2. Set the new chat as active immediately.
    setActiveChatId(newChat.id);

    // 3. Fetch all chats from the server, which now includes the new one.
    // This also updates the UI state.
    const allChats = await fetchChats();

    // 4. Identify any OTHER chats that are empty and can be deleted.
    // We make sure not to delete the chat we just created.
    const chatsToDelete = allChats.filter(
      (chat) => !chat.title && chat.id !== newChat.id
    );

    // 5. If we found any old, empty chats, delete them now.
    if (chatsToDelete.length > 0) {
      const deletePromises = chatsToDelete.map((chat) =>
        fetch(`/api/chat/${chat.id}`, { method: "DELETE" })
      );
      await Promise.all(deletePromises);

      // 6. Refresh the list one last time to show the final, clean state.
      await fetchChats();
    }
  }, [fetchChats]);

  useEffect(() => {
    handleNewChat();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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