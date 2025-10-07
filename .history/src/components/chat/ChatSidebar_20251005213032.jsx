"use client";

import { Button } from "@/components/ui/button";

// ✅ Receives everything it needs as props
export default function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
}) {
  // ❌ No more useState or useEffect needed here!

  return (
    <div className="w-64 flex-shrink-0 border-r bg-gray-50 p-2 overflow-y-auto">
      <Button onClick={onNewChat} className="mb-2 w-full">
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
              {c.title || "New Chat"}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}