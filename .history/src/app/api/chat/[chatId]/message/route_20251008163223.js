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
import { experimental_generateImage as generateImage } from "ai";



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
          content: `You are a helpful  assistant. 
          - Use 'google_search' when the user asks for real-world or current information.
          - Use 'image_gen' if the user asks for a picture, image, diagram, or visual.
          - You may use both together: search first for facts, then generate an image.
          - Otherwise, answer directly (e.g., coding, explanations, etc.).`,
        },

        ...convertToModelMessages(chatHistory),
      ],
      tools: {
        // google_search: google.tools.googleSearch({}),
        // code_execution: google.tools.codeExecution({}),
        // url_context: google.tools.urlContext({}),
          google_search: tool({
          description: "Perform a Google web search for the latest info.",
          parameters: z.object({
            query: z.string(),
          }),
          execute: async ({ query }) => {
            // ✅ FIXED: use google("google-search")
            const searchResults = await google("google-search").invoke({
              input: query,
            });

            const items = searchResults.results || [];
            return items
              .map((r) => `${r.title}: ${r.snippet}`)
              .join("\n")
              .slice(0, 4000); // limit output length
          },
        }),

        // 🎨 IMAGE GENERATION TOOL
        image_gen: tool({
          description: "Generate an image based on a textual prompt",
          parameters: z.object({
            prompt: z.string(),
          }),
          execute: async ({ prompt }) => {
            const image = await generateImage({
              model: google.image('imagen-3.0-generate-002'),
              prompt,
            
               aspectRatio: '16:9',
            });

            return {
              prompt,
              image_url: image.url,
            };
          },
        }),
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
