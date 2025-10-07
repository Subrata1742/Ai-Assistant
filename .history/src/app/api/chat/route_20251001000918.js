import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages,tool,stepCountIs } from "ai";
import {z} from "zod"

const tools = {
  
  //  google_search: google.tools.googleSearch({}),
    
  getWeather: tool({
    description: "Get the weather for a location",
    inputSchema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
    execute: async ({ city }) => {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`
      );
      const data = await response.json();
      const weatherData = {
        location: {
          name: data.location.name,
          country: data.location.country,
          localtime: data.location.localtime,
        },
        current: {
          temp_c: data.current.temp_c,
          condition: {
            text: data.current.condition.text,
            code: data.current.condition.code,
          },
        },
      };
      return weatherData;
    },
  }),
};


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
      tools ,
    //    stopWhen: stepCountIs(2),
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