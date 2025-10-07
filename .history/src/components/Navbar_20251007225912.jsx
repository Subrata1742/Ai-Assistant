'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage, } from '@/components/ui/avatar';
import { Brain } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';

const Navbar = () => {
   const { data: session } = useSession();
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white/70 px-4 backdrop-blur-md md:px-8">
      {/* Logo and App Name */}
      <Link href="/"><div className="flex items-center space-x-2">
        <Brain className="h-6 w-6 text-indigo-600" />
        <span className="text-xl font-bold tracking-tight">ChatBot</span>
      </div></Link>

      {/* Navigation Links (hidden on mobile) */}
      <div className="hidden space-x-4 md:flex">
        <Button variant="ghost">Features</Button>
        {/* <Button variant="ghost">Pricing</Button> */}
        <Button variant="ghost">Contact</Button>
      </div>

      {/* User Actions */}
     {session?(  <div className="flex items-center space-x-4">
       <Button  onClick={() => signOut({ callbackUrl: "/" })} className="rounded-full" variant="outline">
         Sign Out
        </Button>
         
        <Avatar>
          <AvatarImage src={session?.user?.image || ""}/>
          <AvatarFallback className="bg-gray-200">AI</AvatarFallback>
        </Avatar>
      </div>):( <Link href="/login"><Button  className="rounded-full" variant="outline">
         Login
        </Button></Link>)}
    </nav>
  );
};

export default Navbar;
