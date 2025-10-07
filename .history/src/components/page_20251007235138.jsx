'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Brain, Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';




const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 antialiased">
      {/* Hero Section */}
      <motion.section
        className="container flex w-full h-screen max-w-4xl flex-col items-center  p-6 text-center mt-12 pb-16 lg:p-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-all duration-300 hover:scale-105">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span>Powered by the latest LLM technology</span>
        </div>

        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Your AI Assistant for{' '}
          <span className="bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
            Anything
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-700 md:text-xl">
          A powerful and intuitive chatbot designed to help you with writing,
          coding, brainstorming, and more.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
         <Link href="/chat"> <Button
            className="w-full rounded-full px-8 py-6 text-lg font-semibold sm:w-auto"
            variant="default"
          >
            Start Chatting
          </Button></Link>
          <Button
            className="w-full rounded-full px-8 py-6 text-lg font-semibold sm:w-auto"
            variant="outline"
          >
            Learn More
          </Button>
        </div>
      </motion.section>

      {/* Feature Showcase Section */}
      <motion.section
        className="container mt-16 flex w-full h-screen mb-4 max-w-6xl flex-col items-center justify-center gap-12 p-6 lg:flex-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        
       
        {/* Features list */}
        <div className="w-full space-y-8 lg:w-1/2">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Intelligent Responses</h3>
              <p className="mt-1 text-gray-600">
                Get quick, accurate, and context-aware answers to your questions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Seamless Conversation</h3>
              <p className="mt-1 text-gray-600">
                Our chatbot understands and remembers past conversations for a
                natural, flowing experience.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Creative Generation</h3>
              <p className="mt-1 text-gray-600">
                From code snippets to creative stories, our AI can generate text
                in a wide range of styles.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;