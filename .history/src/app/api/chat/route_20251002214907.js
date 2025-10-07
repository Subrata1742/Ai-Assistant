import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages,tool,stepCountIs } from "ai";
import {z} from "zod"

const tools = {
  
  //  google_search: google.tools.googleSearch({}),
    google_search :tool({ description: "Get data for  a Google search.",
    
    // The input can match one of two shapes
    inputSchema: z.union([
      
      z.object({
        type: z.literal("googleSearch"),
        query: z.string(),
      }),
    ]), execute: async (input) => {
      switch (input.type) {
        

        case "googleSearch":
          // Your server calls a search API
          const searchResults = await getJson({ q: input.query, api_key: process.env.SERPAPI_KEY });
          return searchResults.organic_results;
      }
    },

    }),
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