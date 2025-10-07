"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
 import { BiDotsVerticalRounded } from 'react-icons/bi';
// ✅ Receives everything it needs as props
export default function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
   handleDeleteChat
   
}) {
  // ❌ No more useState or useEffect needed here!
 const handleDelete = (e, chatId) => {
    e.stopPropagation(); // ✅ Prevent the chat from being selected
    handleDeleteChat(chatId);
  };
  return (
    
    <div className="w-72 mt-18 pt-0 flex-shrink-0 border-r  bg-gray-50 p-2 overflow-y-auto scrollbar-hide">
     <div className="p-4 pt-6 border-b  sticky top-0  bg-gray-50"> <Button onClick={onNewChat} className="mb-2 w-full">
        + New Chat
      </Button></div>
      <ul className="space-y-1">
        {chats.map((c) => (
          <li key={c.id} className="flex justify-between w-full">
            <Button
              // ✅ Highlight the currently active chat
              variant={c.id === activeChatId ? "secondary" : "ghost"}
              className=" w-full justify-start text-left mr-3 overflow-x-hidden"
              onClick={() => onSelectChat(c.id)}
            ><div className=" overflow-x-hidden ">
              {c.title?c.title:"New Chat"}</div>
            </Button>
            <Button className="bg-transparent  text-black hover:bg-transparent" onClick={(e)=>handleDelete(e,c.id)}><BiDotsVerticalRounded  /></Button>
          </li>
        ))}
      </ul>
    </div>
  );
}