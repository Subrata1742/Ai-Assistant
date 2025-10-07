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
   
}) {
  // ❌ No more useState or useEffect needed here!
 
  return (
    
    <div className="w-64 mt-18 flex-shrink-0 border-r px-4 bg-gray-50 p-2 overflow-y-auto scrollbar-hide">
      <Button onClick={onNewChat} className="mb-2 w-full sticky top-0">
        + New Chat
      </Button>
      <ul className="space-y-1">
        {chats.map((c) => (
          <li key={c.id}>
            <Button
              // ✅ Highlight the currently active chat
              variant={c.id === activeChatId ? "secondary" : "ghost"}
              className="w-full justify-start text-left truncate"
              onClick={() => onSelectChat(c.id)}
            >
              {c.title?c.title:"New Chat"}<BiDotsVerticalRounded />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}