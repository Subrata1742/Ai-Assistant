import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages,tool,stepCountIs } from "ai";
import {z} from "zod"



export async function POST(req) {
    try {
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
      tools:{ google_search: google.tools.googleSearch({}),
    } ,
 
    });
    

    // result.usage.then((usage) => {
    //   console.log({
    //     messageCount: messages.length,
    //     inputTokens: usage.inputTokens,
    //     outputTokens: usage.outputTokens,
    //     totalTokens: usage.totalTokens,
    //   });
    // });
 console.log(messages)
    return result.toUIMessageStreamResponse();

   
    } catch (error) {
          console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
    }
}