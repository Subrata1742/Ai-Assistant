import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
     const session = await getServerSession(authOptions);
     if (!session) return new Response("Unauthorized", { status: 401 });
    const { chatId } = await params;
    const { messages } = await req.json();
    const lastUser = messages[messages.length - 1];
    await prisma.message.create({
      data: {
        chatId,
        role: lastUser.role,
        parts: lastUser.parts,
      },
    });
    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: [
        {
          role: "system",
          content: `You are a helpful coding assistant. 
      - Use tools ONLY when the user clearly asks for weather.
      - Otherwise, answer directly (e.g., coding, explanations, etc.).`,
        },
        ...convertToModelMessages(messages),
      ],
      tools: {
        google_search: google.tools.googleSearch({}),
        code_execution: google.tools.codeExecution({}),
        url_context: google.tools.urlContext({}),
      },
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 8192,
            includeThoughts: true,
          },
        },
      },
      onFinish: async ({ responseMessage }) => {
      // Save assistant’s reply
      await prisma.message.create({
        data: { chatId, role: responseMessage.role, parts: responseMessage.parts },
      });

      // Update chat timestamp
      await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
      });
    },
    });

    console.log(messages);
    return result.toUIMessageStreamResponse({
      
      
      sendReasoning: true,
    });
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
