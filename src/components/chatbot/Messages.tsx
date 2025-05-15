'use client'

import { FC } from 'react'
import { usePathname } from 'next/navigation';
import { IMessage } from '@/types/Chatbot.type';
import { UserCircle } from 'lucide-react';
import Avatar from '../common/Avatar';

interface IMessagesProps {
    messages: IMessage[];
    chatbotName: string;
}


const Messages:FC<IMessagesProps> = ({messages, chatbotName}) => {

    const path = usePathname();
    const isReviewsPage = path.includes('review-sessions');

  return (
    <div className='w-full flex flex-col overflow-y-auto space-y-10 py-10 px-5 bg-white rounded-lg'>
        {messages.map(message => {
            const isSenderAi = message.sender !== 'user'

        return (
            <div key={message.id} className={`chat ${isSenderAi ? 'chat-start' : 'chat-end'} relative`}>
                {isReviewsPage && (
                    <p className="absolute -bottom-5 text-xs text-gray-300">
                        sent {new Date(message.created_at).toLocaleString()}
                    </p>
                )}
                <div className={`chat-image avatar w-10 ${!isSenderAi && '-mr-4'}`}>
                    {isSenderAi ? (
                        <Avatar seed={chatbotName} className="h-12 w-12 bg-white rounded-full border-2 border-[#2991EE]"/>
                    ) : (
                        <UserCircle className="text-[#2991EE]"/>
                    )}
                </div>
                <p className={`chat-bubble text-white ${isSenderAi ? 'chat-bubble-primary bg-[#4D7DFB]' : 'chat-bubble-secondary bg-gray-200 text-gray-700'}`}>{message.content}</p>
            </div>
        )
        })}
    </div>
  )
}

export default Messages