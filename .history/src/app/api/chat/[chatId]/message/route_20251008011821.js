import { google } from "@ai-sdk/google";
import {
  streamText,
  convertToModelMessages,
  generateText,
  tool,
  stepCountIs,
} from "ai";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });
    const { chatId } = await params;
    const { messages } = await req.json();
    const lastUser = messages[messages.length - 1];
    //save user msg
    await prisma.message.create({
      data: {
        chatId,
        role: lastUser.role,
        parts: lastUser.parts,
      },
    });
    const chatHistory = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
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

        ...convertToModelMessages(chatHistory),
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
    });
    return result.toUIMessageStreamResponse({
      onFinish: async ({ responseMessage }) => {
        //save msg to database
        await prisma.message.create({
          data: {
            chatId,
            role: responseMessage.role,
            parts: responseMessage.parts,
          },
        });

        const chat = await prisma.chat.findUnique({
          where: { id: chatId }, //
          select: { title: true },
        });

        //update tittle
        let newTitle = null;

        if (chat && !chat.title) {
          const assistantText = responseMessage.parts
            .map((part) => part.text)
            .join("");

          const titlePrompt = `Create a short, concise title (5 words or less) for this conversation:\n\nrole: ${responseMessage.role}\n content: ${assistantText}`;

          const { text: title } = await generateText({
            model: google("gemini-2.5-flash"),
            prompt: titlePrompt,
          });
          newTitle = title.replace(/"/g, "");

          await prisma.chat.update({
            where: { id: chatId },
            data: { title: newTitle },
          });
        }
      },

      sendReasoning: true,
    });
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
