"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  
  Send,
  Mic,
  Volume2,
} from "lucide-react";

export default function ChatPage() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error, stop } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };

  return ( <Card>
    <CardContent className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4">{error.message}</div>}

      {messages.map((message) => (
        <div key={message.id} className="mb-4">
          <div className="font-semibold">
            {message.role === "user" ? "You:" : "AI:"}
          </div>
          {message.parts.map((part, index) => {
            switch (part.type) {
              case "text":
                return (
                  <div
                    key={`${message.id}-${index}`}
                    className="whitespace-pre-wrap"
                  >
                    {part.text}
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      ))}
      {(status === "submitted" || status === "streaming") && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <div className="flex gap-2">
          <input
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How can I help you?"
          />
          {status === "submitted" || status === "streaming" ? (
            <button
              onClick={stop}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={status !== "ready"}
            >
              Send
            </button>
          )}
        </div>
      </form>
    </CardContent></Card>
  );
}
// "use client";

// import { useChat } from "@ai-sdk/react";
// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
  
//   Send,
//   Mic,
//   Volume2,
// } from "lucide-react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

// export default function Chat() {
//   const [input, setInput] = useState("");
//   const { messages, sendMessage, status } = useChat();

//   const handleSubmit=(e)=>{
//     e.preventDefault();
//      sendMessage({ text: input });
//     setInput("");

// }
// //   const [isListening, setIsListening] = useState(false);

// //   const recognitionRef = useRef(null);
// //   const lastSpokenId = useRef(null);

// //   const handleMic = async () => {
// //     if (!("webkitSpeechRecognition" in window)) {
// //       alert("Speech recognition not supported on this device/browser.");
// //       return;
// //     }

// //     try {
// //       await navigator.mediaDevices.getUserMedia({ audio: true });
// //     } catch {
// //       alert("Microphone permission denied.");
// //       return;
// //     }
// //     if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
// //     window.speechSynthesis.cancel();
// //   }

// //     const recognition = new window.webkitSpeechRecognition();
// //     recognition.continuous = false;
// //     recognition.interimResults = false;
// //     recognition.lang = "hi-IN";

// //     recognition.onresult = (event) => {
// //       const text = event.results[0][0].transcript;
// //       setInput(text);
// //       sendMessage({ text });
// //     };

// //     recognition.onerror = (event) => console.error(event.error);

// //     recognition.start();
// //     setIsListening(true);

// //     recognition.onend = () => setIsListening(false);
// //   };

// //   // Speak AI reply with SpeechSynthesis API
// //   const speak = (text) => {
// //     if(isListening)return;
// //     const synth = window.speechSynthesis;
// //     if (!synth) return;
// //     const utterance = new SpeechSynthesisUtterance(text);
// //     utterance.lang = "hi-IN";
// //     utterance.rate = 1.3; // speed
// //     utterance.pitch = 1; // tone
// //     utterance.volume = 1;
// //     synth.speak(utterance);
// //   };

// //   useEffect(() => {
// //     const aiMessages = messages.filter((m) => m.role !== "user");
// //     if (aiMessages.length === 0) return;

// //     const latest = aiMessages[aiMessages.length - 1];
// //     const text = latest.parts.map((p) => p.text).join(" ");

// //     // ✅ Speak only if the text stopped changing
// //     if (text && latest.id !== lastSpokenId.current) {
// //       // Add small delay to ensure full text arrives
// //       const timeout = setTimeout(() => {
// //         speak(text);
// //         lastSpokenId.current = latest.id;
// //       }, 500); // wait 0.5s before speaking

// //       return () => clearTimeout(timeout);
// //     }
// //   }, [messages]);
// console.log(messages);
//   return (
//     <div className="min-h-screen w-full flex justify-center items-center ">
//       <Card className="w-full md:max-w-[70vw] max-w-xl mt-18 flex-grow overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg lg:w-1/2">
//         <CardContent className="p-0">
//           <div className="flex h-[80vh]  flex-col overflow-hidden">
//             <div className="flex flex-grow flex-col space-y-4 overflow-y-auto p-4">
//               {messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   className={`flex ${
//                     msg.role === "user" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div className="text-slate-400">
//                     {msg.role === "user" ? "you " : "Gemini"}
//                     {msg.parts.map((part, i) => {
                    
//                       switch (part.type) {
                        
//                         case "text":
//                           return (
//                             <div
//                               key={`${msg.id}-${i}`}
//                               className={`max-w-full rounded-2xl p-5 ${
//                                 msg.role === "user"
//                                   ? "rounded-br-none bg-blue-500 text-white"
//                                   : "rounded-bl-none bg-gray-200 text-gray-800"
//                               }`}
//                             >{part.text}
//                               {/* <ReactMarkdown
//                                 remarkPlugins={[remarkGfm]}
//                                 components={{
//                                   p: ({ node, children, ...props }) => {
//                                     // ✅ Prevent <pre> from being inside <p>
//                                     if (
//                                       children &&
//                                       Array.isArray(children) &&
//                                       children.length === 1 &&
//                                       children[0].type === "code"
//                                     ) {
//                                       return <>{children}</>;
//                                     }
//                                     return (
//                                       <p
//                                         className="my-1 leading-relaxed"
//                                         {...props}
//                                       >
//                                         {children}
//                                       </p>
//                                     );
//                                   },
//                                   code: ({
//                                     node,
//                                     inline,
//                                     className,
//                                     children,
//                                     ...props
//                                   }) => {
//                                     if (inline) {
//                                       return (
//                                         <code
//                                           className="bg-gray-200 px-1 rounded"
//                                           {...props}
//                                         >
//                                           {children}
//                                         </code>
//                                       );
//                                     }
//                                     return (
//                                       <pre className="bg-black text-white p-3 rounded-lg overflow-x-auto">
//                                         <code {...props}>{children}</code>
//                                       </pre>
//                                     );
//                                   },
//                                   li: ({ node, ...props }) => (
//                                     <li className="list-disc ml-6" {...props} />
//                                   ),
//                                   h1: ({ node, ...props }) => (
//                                     <h1
//                                       className="text-2xl font-bold my-2"
//                                       {...props}
//                                     />
//                                   ),
//                                   h2: ({ node, ...props }) => (
//                                     <h2
//                                       className="text-xl font-semibold my-2"
//                                       {...props}
//                                     />
//                                   ),
//                                 }}
//                               >
//                                 {part.text}
//                               </ReactMarkdown> */}
//                             </div>
//                           ); 
                          
//                       }
//                     })}{" "}
//                   </div>
//                 </div>
//               ))}
//               {status === "submitted" && (
//                 <div className="flex justify-start">
//                   <div className="max-w-xs rounded-2xl rounded-bl-none bg-gray-200 text-gray-800 p-3 animate-pulse">
//                     AI is typing...
//                   </div>
//                 </div>
//               )}
//             </div>

//             <form
//               onSubmit={(e) => {
//                 handleSubmit
//               }}
//             >
//               <div className="flex items-center space-x-2 border-t border-gray-200 bg-gray-50 p-4">
//                 <Input
//                   value={input}
//                   className="flex-1 rounded-full bg-white px-4 py-2"
//                   placeholder="Ask me anything..."
//                   onChange={(e) => setInput(e.target.value)}
//                 />{" "}
//                 {/* <Button
//                   type="button"
//                   className="rounded-full p-2"
//                   onClick={handleMic}
//                 >
//                   <Mic
//                     className={`h-4 w-4 ${isListening ? "text-red-500" : ""}`}
//                   />
//                 </Button> */}
//                 <Button className="rounded-full p-2" type="submit">
//                   <Send className="h-4 w-4" />
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }