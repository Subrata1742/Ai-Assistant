"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  handleDeleteChat,
}) {
  const handleDelete = (e, chatId) => {
    e.stopPropagation();
    handleDeleteChat(chatId);
  };
   const currentChat = chats.filter((chat) => chat.id===activeChatId);
   console.log(currentChat[0].title)
  return (
    // <div className="w-72 mt-18 pt-0 flex-shrink-0 border-r  bg-gray-50 p-2 overflow-y-auto scrollbar-hide">
    //   <div className="p-4 pt-6 border-b  sticky top-0  bg-gray-50">
    //     {" "}
    //     <Button onClick={onNewChat} className="mb-2 w-full">
    //       + New Chat
    //     </Button>
    //   </div>
    //   <ul className="space-y-1">
    //     {chats.map((c) => (
    //       <li key={c.id} className="flex justify-between w-full">
    //         {/* history chat */}
    //         <Button
    //           variant={c.id === activeChatId ? "secondary" : "ghost"}
    //           className="w-[83%] justify-start text-left mr-3 overflow-x-hidden"
    //           onClick={() => onSelectChat(c.id)}
    //         >
    //           <div className=" overflow-x-hidden ">
    //             {c.title ? c.title : "New Chat"}
    //           </div>
    //         </Button>
    //         <Button
    //           className="bg-transparent  text-black hover:bg-transparent"
    //           onClick={(e) => handleDelete(e, c.id)}
    //         >
    //           <MdDelete />
    //         </Button>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
    <Sidebar className=" pt-0">
      <SidebarContent >
        <SidebarGroup className="pt-0">
          <div className="p-4  z-10 border-b sticky top-0 bg-gray-50">
            <Button  onClick={onNewChat}  className="mb-2 w-full" disabled={currentChat.title===""}>
              + New Chat
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="overflow-auto">
              {chats.map((c) => (
                <SidebarMenuItem
                  key={c.id}
                  className="flex my-1 justify-between w-full"
                >
                  <SidebarMenuButton
                    variant={c.id === activeChatId ? "secondary" : "ghost"}
                    onClick={() => onSelectChat(c.id)}
                    asChild
                  >
                    <div className=" overflow-x-hidden ">
                      {c.title ? c.title : "New Chat"}
                    </div>
                  </SidebarMenuButton>
                  <Button
                    className="bg-transparent  text-black hover:bg-transparent"
                    onClick={(e) => handleDelete(e, c.id)}
                  >
                    <MdDelete />
                  </Button>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
