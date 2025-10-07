import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages,tool,stepCountIs } from "ai";
import {z} from "zod"
import prisma from "@/lib/prisma"



export async function POST(req) {
     
    try {
        const { chatId } = params;
        const {messages}= await req.json();
         const result = streamText({
      model: google('gemini-2.5-flash'),
       messages: [
    {
      role: "system",
      content: `You are a helpful coding assistant. 
      - Use tools ONLY when the user clearly asks for weather.
      - Otherwise, answer directly (e.g., coding, explanations, etc.).`,
    },
    ...convertToModelMessages(messages),
  ],
      tools:{ 
        google_search: google.tools.googleSearch({}),
      code_execution: google.tools.codeExecution({}),
       url_context: google.tools.urlContext({}),
    } , providerOptions: {
    google: {
      thinkingConfig: {
        thinkingBudget: 8192,
        includeThoughts: true,
      },
    },
  },
 
    });
     const lastUser = messages[messages.length - 1]
  await prisma.message.create({
    data: {
      chatId,
      role: lastUser.role,
      parts: lastUser.parts,
    },
  })
 console.log(messages)
    return result.toUIMessageStreamResponse({
       async onFinal(completion) {
      await prisma.message.create({
        data: {
          chatId,
          role: "assistant",
          parts: [{ type: "text", text: completion.text }],
        },
      })
    },
      sendReasoning: true,
    });

   
    } catch (error) {
          console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
    }
}