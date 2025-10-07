"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";

export default function ChatSidebar({ onSelectChat, onNewChat ,chatId}) {
  const [chats, setChats] = useState([]);
 const { messages, } = useChat({
     transport: new DefaultChatTransport({
       api:`/api/chat/${chatId}/message`,
     
    }),
   
  });
  useEffect(() => {
    fetch("/api/chat/list")
      .then(r => r.json())
      .then(setChats);
  }, [onNewChat]);

  return (
    <div className="w-64 border-r mt-18 p-2 overflow-y-hidden">
      <Button onClick={onNewChat} className="mb-2 w-full">+ New Chat</Button>
      <ul className="space-y-1">
        {chats.map(c => (
          <li key={c.id}>
            <Button variant="ghost" className="w-full text-left" onClick={() => onSelectChat(c.id)}>
              {c.title || "Untitled"}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
