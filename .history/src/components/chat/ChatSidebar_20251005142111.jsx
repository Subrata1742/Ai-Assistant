"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ChatSidebar({ onSelectChat, onNewChat }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetch("/api/chat/list")
      .then(r => r.json())
      .then(setChats);
  }, []);

  return (
    <div className="w-64 border-r p-2">
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
