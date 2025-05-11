import { GET_USER_CHATBOTS } from '@/lib/graphql/queries';
import { serverClient } from '@/lib/graphql/server/serverClient';
import { IGetUserChatbotsVariables, IGetUserChatbotsResponse, IChatbot } from '@/types/Chatbot.type';
import { auth } from '@clerk/nextjs/server';
import React from 'react'

const ReviewSessions = async () => {

 const { userId } = await auth();
    if (!userId) return;

    const {data: { chatbotsByUser }} = await serverClient.query<IGetUserChatbotsResponse, IGetUserChatbotsVariables>({
        query: GET_USER_CHATBOTS,
        variables: {
            userId,
        },
    });

    const sortedChatbotsByUser: IChatbot[] = chatbotsByUser.map(chatbot => ({
        ...chatbot,
        chat_sessions: [...chatbot.chat_sessions].sort((a, b) => {
            //? Sort by ascending order
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }),
    }))

  return (
    <div>
        <h1 className="text-xl lg:text-3xl font-semibold mt-10">Chat Sessions</h1>
        <h2 className="mb-5">
            Review all the chat sessions the chat bots have had with your customers.
        </h2>
    </div>
  )
}

export default ReviewSessions;