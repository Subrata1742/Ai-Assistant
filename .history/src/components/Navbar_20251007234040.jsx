'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage, } from '@/components/ui/avatar';
import { Brain } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';

const Navbar = () => {
   const { data: session,status } = useSession();
    const [isMounted, setIsMounted] = useState(false);

    // 2. Set the mounted state to true after the initial render
    useEffect(() => {
        setIsMounted(true);
    }, []);
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
      <div className="flex items-center space-x-4">
     {(!isMounted||status === 'loading') ? (
                    // Render a placeholder or skeleton while loading to prevent layout shift
                    <div className="h-10 w-24 rounded-full bg-gray-200 animate-pulse" />
                ) :session?(  < >
       <Button  onClick={() => signOut({ callbackUrl: "/" })} className="rounded-full" variant="outline">
         Sign Out
        </Button>
         
        <Avatar>
          <AvatarImage src={session?.user?.image || ""}/>
          <AvatarFallback className="bg-gray-200">  {session.user.name?.charAt(0) || "AI"}</AvatarFallback>
        </Avatar>
      </>):(  <>
       <Link href="/login"><Button  className="rounded-full" variant="outline">
         Login
        </Button></Link>
         
         <Link href="/register"><Button  className="rounded-full" variant="outline">
         Sign In
        </Button></Link>
      </>)}</div>
    </nav>
  );
};

export default Navbar;
