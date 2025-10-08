import React from 'react'

export default function StyledOutput() {
  return (
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
  )
}
