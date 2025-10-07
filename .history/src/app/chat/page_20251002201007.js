"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Mic, Volume2, SquarePause } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { WeatherCard } from "@/components/chat/weather-card";
import Image from "next/image";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop } = useChat();
  const scrollRef = useRef();
  const [files, setFiles] = useState(undefined);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === "") return;
    sendMessage({ text: input, files });
    setInput("");
    setFiles(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  //   const [isListening, setIsListening] = useState(false);

  //   const recognitionRef = useRef(null);
  //   const lastSpokenId = useRef(null);

  //   const handleMic = async () => {
  //     if (!("webkitSpeechRecognition" in window)) {
  //       alert("Speech recognition not supported on this device/browser.");
  //       return;
  //     }

  //     try {
  //       await navigator.mediaDevices.getUserMedia({ audio: true });
  //     } catch {
  //       alert("Microphone permission denied.");
  //       return;
  //     }
  //     if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
  //     window.speechSynthesis.cancel();
  //   }

  //     const recognition = new window.webkitSpeechRecognition();
  //     recognition.continuous = false;
  //     recognition.interimResults = false;
  //     recognition.lang = "hi-IN";

  //     recognition.onresult = (event) => {
  //       const text = event.results[0][0].transcript;
  //       setInput(text);
  //       sendMessage({ text });
  //     };

  //     recognition.onerror = (event) => console.error(event.error);

  //     recognition.start();
  //     setIsListening(true);

  //     recognition.onend = () => setIsListening(false);
  //   };

  //   // Speak AI reply with SpeechSynthesis API
  const speak = (text) => {
    // if(isListening)return;
    // let cleanText = text?.replace(
    //   /```[\s\S]*?```/g,
    //   "Here you can see code example"
    // );
    // cleanText = cleanText?.replace(/`[^`]+`/g, "Here you can see code example");
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 1.3; // speed
    utterance.pitch = 1; // tone
    utterance.volume = 1;
    synth.speak(utterance);
  };

  //   useEffect(() => {
    const handleSpeak =()=>{
      const aiMessages = messages.filter((m) => m.role !== "user");
      if (aiMessages.length === 0) return;

      const latest = aiMessages[aiMessages.length - 1];
      const text = latest.parts.map((p) => p.text).join(" ");

      // ✅ Speak only if the text stopped changing
      if (text && latest.id !== lastSpokenId.current) {
        // Add small delay to ensure full text arrives
        const timeout = setTimeout(() => {
          speak(text);
          lastSpokenId.current = latest.id;
        }, 500); // wait 0.5s before speaking

        return () => clearTimeout(timeout);
      }}
  //   }, [messages]);
  console.log(messages);
  return (
    <div className="min-h-screen w-full flex justify-center items-center ">
      <Card className="w-full md:max-w-[70vw] max-w-xl mt-18 flex-grow rounded-xl border border-gray-200 bg-white shadow-lg lg:w-1/2">
        <CardContent className="p-0">
          <div className="flex h-[80vh]  flex-col overflow-y-hidden">
            <div className="flex flex-grow flex-col space-y-4 overflow-y-auto p-4">
              {error && (
                <div className="text-red-500 mb-4">{error.message}</div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="text-slate-400">
                    {message.role === "user" ? "you " : "AI"}
                    {message.parts.map((part, index) => {
                     
                      switch (part.type) {
                        case "tool-getWeather":
                          switch (part.state) {
                            case "input-streaming":
                              return (
                                <div
                                  key={`${message.id}-getWeather-${index}`}
                                  className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1 mb-2"
                                >
                                  <div className="text-sm text-zinc-500">
                                    🌤️ Receiving weather request...
                                  </div>
                                  <pre className="text-xs text-zinc-600 mt-1">
                                    {JSON.stringify(part.input, null, 2)}
                                  </pre>
                                </div>
                              );

                            case "input-available":
                              return (
                                <div
                                  key={`${message.id}-getWeather-${index}`}
                                  className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1 mb-2"
                                >
                                  <div className="text-sm text-zinc-400">
                                    🌤️ Getting weather for {part.input.city}...
                                  </div>
                                </div>
                              );

                            case "output-available":
                              return (
                                <div
                                  key={`${message.id}-getWeather-${index}`}
                                  className="mt-1 mb-2"
                                >
                                  <div className="text-sm text-zinc-400">
                                    🌤️ Weather
                                  </div>
                                  <div className="text-sm text-zinc-300">
                                    <WeatherCard weatherData={part.output} />
                                  </div>
                                </div>
                              );

                            case "output-error":
                              return (
                                <div
                                  key={`${message.id}-getWeather-${index}`}
                                  className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1 mb-2"
                                >
                                  <div className="text-sm text-red-400">
                                    Error: {part.errorText}
                                  </div>
                                </div>
                              );

                            default:
                              return null;
                          }
                        case "text":
                          return (
                            <div
                              key={`${message.id}-${index}`}
                              className={`max-w-full rounded-2xl p-5 ${
                                message.role === "user"
                                  ? "rounded-br-none bg-blue-500 text-white"
                                  : "rounded-bl-none bg-gray-200 text-gray-800"
                              }`}
                            >
                              {" "}
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  // Headings
                                  h1: ({ node, ...props }) => (
                                    <h1
                                      className="text-3xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-300 dark:border-gray-600"
                                      {...props}
                                    />
                                  ),
                                  h2: ({ node, ...props }) => (
                                    <h2
                                      className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
                                      {...props}
                                    />
                                  ),
                                  h3: ({ node, ...props }) => (
                                    <h3
                                      className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-4"
                                      {...props}
                                    />
                                  ),

                                  // Text & Paragraphs
                                  p: ({ node, ...props }) => (
                                    <p
                                      className={`mb-1 ${
                                        message.role === "user"
                                          ? "text-white"
                                          : " text-gray-700"
                                      } dark:text-gray-300 leading-relaxed`}
                                      {...props}
                                    />
                                  ),
                                  strong: ({ node, ...props }) => (
                                    <strong
                                      className="font-bold text-gray-800 dark:text-gray-200"
                                      {...props}
                                    />
                                  ),
                                  a: ({ node, ...props }) => (
                                    <a
                                      className="text-blue-600 dark:text-blue-400 hover:underline"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      {...props}
                                    />
                                  ),

                                  // Lists (handles nested lists automatically)
                                  ul: ({ node, ...props }) => (
                                    <ul
                                      className="list-disc list-outside mb-4 pl-6 space-y-3"
                                      {...props}
                                    />
                                  ),
                                  ol: ({ node, ...props }) => (
                                    <ol
                                      className="list-decimal list-outside mb-4 pl-6 space-y-3"
                                      {...props}
                                    />
                                  ),
                                  li: ({ node, ...props }) => (
                                    <li
                                      className="text-gray-700 dark:text-gray-300"
                                      {...props}
                                    />
                                  ),

                                  // Code: Fenced blocks and inline
                                  code({
                                    node,
                                    inline,
                                    className,
                                    children,
                                    ...props
                                  }) {
                                    const match = /language-(\w+)/.exec(
                                      className || ""
                                    );
                                    // Fenced code blocks
                                    if (!inline && match) {
                                      return (
                                        <div className="my-4 rounded-md overflow-hidden">
                                          <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                          >
                                            {String(children).replace(
                                              /\n$/,
                                              ""
                                            )}
                                          </SyntaxHighlighter>
                                        </div>
                                      );
                                    }
                                    // Inline code
                                    return (
                                      <code
                                        className="font-mono text-sm bg-gray-200 dark:bg-gray-700 text-purple-600 dark:text-purple-400 rounded-md px-1.5 py-1"
                                        {...props}
                                      >
                                        {children}
                                      </code>
                                    );
                                  },
                                }}
                              >
                                {part.text}
                              </ReactMarkdown>
                              
                            </div>
                          );
                        case "file":
                          if (part.mediaType?.startsWith("image/")) {
                            return (
                              <Image
                                key={`${message.id}-${index}`}
                                src={part.url}
                                alt={part.filename ?? `attachment-${index}`}
                                width={500}
                                height={500}
                              />
                            );
                          }
                          if (part.mediaType?.startsWith("application/pdf")) {
                            return (
                              <iframe
                                key={`${message.id}-${index}`}
                                src={part.url}
                                width="500"
                                height="600"
                                title={part.filename ?? `attachment-${index}`}
                              />
                            );
                          }
                          return null;
                        //        case "tool-google_search":
                        // switch (part.state) {
                        //   case "input-streaming":
                        //     return (
                        //       <div
                        //         key={`${message.id}-web_search-${index}`}
                        //         className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1 mb-2"
                        //       >
                        //         <div className="text-sm text-zinc-500">
                        //           🔍 Preparing to search...
                        //         </div>
                        //       </div>
                        //     );
                        //   case "input-available":
                        //     return (
                        //       <div
                        //         key={`${message.id}-web_search-${index}`}
                        //         className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1 mb-2"
                        //       >
                        //         <div className="text-sm text-zinc-400">
                        //           🔍 Searching the web...
                        //         </div>
                        //       </div>
                        //     );
                        //   case "output-available":
                        //     return (
                        //       <React.Fragment
                        //         key={`${message.id}-web_search-${index}`}
                        //       >
                        //         <div className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1 mb-2">
                        //           <div className="text-sm text-zinc-400">
                        //             ✅ Web search complete
                        //           </div>
                        //         </div>

                        //         {message.role === "assistant" &&
                        //           sources.length > 0 && (
                        //             <div className="mb-2">
                        //               <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        //                 <div className="flex items-center gap-2 mb-2">
                        //                   <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                        //                    Source {/* Sources ({sources.length}) */}
                        //                   </span>
                        //                 </div>

                        //                 {/* <div className="space-y-2">
                        //                   {sources.map((part, i) => {
                        //                     if (part.type === "source-url") {
                        //                       return (
                        //                         <a
                        //                           key={`${message.id}-${i}`}
                        //                           href={part.url}
                        //                           target="_blank"
                        //                           rel="noopener noreferrer"
                        //                           className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm underline truncate"
                        //                           title={part.url}
                        //                         >
                        //                           {part.title || part.url}
                        //                         </a>
                        //                       );
                        //                     }
                        //                   })}
                        //                 </div> */}
                        //               </div>
                        //             </div>
                        //           )}
                        //       </React.Fragment>
                        //     );
                        //   case "output-error":
                        //     return (
                        //       <div
                        //         key={`${message.id}-web_search-${index}`}
                        //         className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1 mb-2"
                        //       >
                        //         <div className="text-sm text-red-400">
                        //           ❌ Web search failed: {part.errorText}
                        //         </div>
                        //       </div>
                        //     );
                        //   default:
                        //     return null;
                        // }
                        
                        default:
                          return null;
                      }
                      
                    })}
                     {message.role === "user" ? "" : <Button onClick={handleSpeak} className="bg-transparent border text-slate-500"> <Volume2/></Button>}
                  </div>
                </div>
              ))}
              {(status === "submitted" || status === "streaming") && (
                <div className="flex justify-start">
                  <div className="max-w-xs rounded-2xl rounded-bl-none bg-gray-200 text-gray-800 p-3 animate-pulse">
                    AI is typing...
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex items-center space-x-2 border-t border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="file-upload"
                    className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                    </svg>
                    {files?.length
                      ? `${files.length} file${
                          files.length > 1 ? "s" : ""
                        } attached`
                      : "Attach files"}
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={(event) => {
                      if (event.target.files) {
                        setFiles(event.target.files);
                      }
                    }}
                    multiple
                    ref={fileInputRef}
                  />
                </div>
                <Input
                  className="flex-1 rounded-full bg-white px-4 py-2"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="How can I help you?"
                />
                {status === "submitted" || status === "streaming" ? (
                  <Button
                    type="button"
                    onClick={stop}
                    className="rounded-full p-2 bg-red-600"
                  >
                    <SquarePause />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={status !== "ready"}
                  >
                    <Send />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
