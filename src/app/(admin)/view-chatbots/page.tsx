export const dynamic = "force-dynamic"; //? We need to fetch data on every request on the server to show the latest data

import { Avatar } from "@/components";
import { Button } from "@/components/ui/button";
import { GET_CHATBOTS_BY_USER } from "@/lib/graphql/queries";
import { serverClient } from "@/lib/graphql/server/serverClient";
import {
  IChatbot,
  IGetChatbotsByUserResponse,
  IGetChatbotsByUserVariables,
} from "@/types/Chatbot.type";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const ViewChatbots = async () => {
  const { userId } = await auth();

  if (!userId) return;

  const {
    data: { chatbotsByUser },
  } = await serverClient.query<
    IGetChatbotsByUserResponse,
    IGetChatbotsByUserVariables
  >({
    query: GET_CHATBOTS_BY_USER,
    variables: {
      clerk_user_id: userId,
    },
  });

  const sortedChatbots: IChatbot[] = [...chatbotsByUser].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="flex-1 pb-20 p-10">
      <h1 className="text-xl lg:text-3xl font-semibold mb-5">
        Active Chatbots
      </h1>
      {sortedChatbots.length === 0 && (
        <div>
          <p>
            You have not created any chatbots yet, Click on the button below to
            create a new one.
          </p>
          <Link href={"/create-chatbot"}>
            <Button className="bg-[#64B5F5] text-white p-3 rounded-md mt-5">
              Create Chatbot
            </Button>
          </Link>
        </div>
      )}
      <ul className="flex flex-col space-y-5">
        {sortedChatbots.map((chatbot) => (
          <Link key={chatbot.id} href={`/edit-chatbot/${chatbot.id}`}>
            <li className="relative p-10 border rounded-md max-w-3xl bg-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Avatar seed={chatbot.name} />
                  <h2 className="text-xl font-bold">{chatbot.name}</h2>
                </div>
                <p className="absolute top-5 right-5 text-xs text-gray-400">
                  Created: {new Date(chatbot.created_at).toLocaleDateString()}
                </p>
              </div>
              <hr className="mt-2" />
              <div className="grid grid-cols-2 gap-10 md:gap-5 p-5">
                <h3 className="italic">Characteristics:</h3>
                <ul className="text-xs">
                  {!chatbot.chatbot_characteristics.length && (
                    <p className="text-sm text-gray-500">
                      No characteristics added yet.
                    </p>
                  )}
                  {chatbot.chatbot_characteristics.map(characteristic => (
                    <li
                      key={characteristic.id}
                      className="list-disc break-words"
                    >
                      {characteristic.content}
                    </li>
                  ))}
                </ul>
                <h3 className="italic">No of Sessions:</h3>
                <p>{chatbot.chat_sessions.length}</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default ViewChatbots;
