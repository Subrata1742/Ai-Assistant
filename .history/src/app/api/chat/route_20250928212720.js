import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";

export async function POST(req) {
    try {
        const {messages}= await req.json();
         const result = streamText({
      model: google('gemini-2.5-flash'),
      messages : convertToModelMessages(messages)
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You are a helpful coding assistant. Keep responses under 3 sentences and focus on practical examples.",
    //     },
    //     ...convertToModelMessages(messages),
    //   ],
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