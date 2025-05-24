"use client";

import { FC, useEffect } from "react";
import { usePathname } from "next/navigation";
import { IMessage } from "@/types/Chatbot.type";
import { UserCircle } from "lucide-react";
import Avatar from "../common/Avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IMessagesProps {
  messages: IMessage[];
  chatbotName: string;
}

const Messages: FC<IMessagesProps> = ({ messages, chatbotName }) => {
  const path = usePathname();
  const isReviewsPage = path.includes("review-sessions");

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto space-y-10 py-10 px-5 bg-white rounded-lg">
      {messages.map((message) => {
        const isSenderAi = message.sender !== "user";

        return (
          <div
            key={message.id}
            className={`chat ${
              isSenderAi ? "chat-start" : "chat-end"
            } relative`}
          >
            {isReviewsPage && (
              <p className="absolute -bottom-5 text-xs text-gray-300">
                sent {new Date(message.created_at).toLocaleString()}
              </p>
            )}
            <div className={`chat-image avatar w-10 ${!isSenderAi && "-mr-4"}`}>
              {isSenderAi ? (
                <Avatar
                  seed={chatbotName}
                  className="h-12 w-12 bg-white rounded-full border-2 border-[#2991EE]"
                />
              ) : (
                <UserCircle className="text-[#2991EE]" />
              )}
            </div>
            <div
              className={`chat-bubble text-white ${
                isSenderAi
                  ? "chat-bubble-primary bg-[#4D7DFB]"
                  : "chat-bubble-secondary bg-gray-200 text-gray-700"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  ul: ({ node, ...props }) => (
                    <ul
                      {...props}
                      className="list-decimal list-inside ml-5 mb-5"
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      {...props}
                      className="list-decimal list-inside ml-5 mb-5"
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1 {...props} className="text-2xl font-bold mb-5" />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 {...props} className="text-xl font-bold mb-5" />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 {...props} className="text-lg font-bold mb-5" />
                  ),
                  table: ({ node, ...props }) => (
                    <table
                      {...props}
                      className="table-auto w-full border-separate border-2 rounded-sm border-spacing-4 border-white mb-5"
                    />
                  ),
                  th: ({ node, ...props }) => (
                    <th {...props} className="text-left underline" />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      {...props}
                      className={`whitespace-break-spaces mb-5 ${
                        message.content === "Thinking..." && "animate-pulse"
                      } ${isSenderAi ? "text-white" : "text-gray-700"}`}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline hover:text-blue-400"
                    />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
