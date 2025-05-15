export const dynamic = 'force-dynamic';

import { Messages } from '@/components';
import { GET_CHAT_SESSION_MESSAGES } from '@/lib/graphql/queries';
import { serverClient } from '@/lib/graphql/server/serverClient';
import { IGetChatSessionMessagesResponse, IGetChatSessionMessagesVariables } from '@/types/Chatbot.type';
import { IPageParams } from '@/types/Common.type'
import { FC } from 'react'

const ReviewSession: FC<IPageParams<{ id: string }>> = async ({params}) => {

const { id } = await params;

const {data: { chat_sessions: {
  id: chatSessionId,
  created_at,
  messages,
  chatbots: {
    name
  },
  guests: {
    name: guestName, email
  }
} }} = await serverClient.query<IGetChatSessionMessagesResponse, IGetChatSessionMessagesVariables>({
    query: GET_CHAT_SESSION_MESSAGES,
    variables: {
        id: parseInt(id),
      }
})

  return (
    <div className='w-full p-10 pb-24'>
      <h1 className="text-xl lg:text-3xl font-semibold">Session Review</h1>
      <p className="font-light text-xs text-gray-400 mt-2">Started at {new Date(created_at).toLocaleString()}</p>
      <h2 className="font-light mt-2">
        Between {name} & {" "}
        <span className="font-extrabold">{guestName} ({email})</span>
      </h2>
      <hr className="my-10" />

      <Messages messages={messages} chatbotName={name}/>
    </div>
  )
}

export default ReviewSession