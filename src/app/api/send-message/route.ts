import { INSERT_MESSAGE } from "@/lib/graphql/mutations";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/lib/graphql/queries";
import { serverClient } from "@/lib/graphql/server/serverClient";
import {
  IGetChatbotByIdResponse,
  IMessagesByChatSessionIdResponse,
} from "@/types/Chatbot.type";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (request: NextRequest) => {
  const { name, chat_session_id, chatbot_id, content } = await request.json();
  console.log(
    `Received message from chat session ${chat_session_id}: ${content} (chatbot: ${chatbot_id})`
  );

  try {
    //* Step 1: Fetch chatbot characteristics
    const { data } = await serverClient.query<IGetChatbotByIdResponse>({
      query: GET_CHATBOT_BY_ID,
      variables: { id: chatbot_id },
    });
    const chatbot = data.chatbots;
    if (!chatbot) {
      console.error(`Chatbot with ID ${chatbot_id} not found`);
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    //* Step 2: Fetch previous messages
    const { data: messagesData } =
      await serverClient.query<IMessagesByChatSessionIdResponse>({
        query: GET_MESSAGES_BY_CHAT_SESSION_ID,
        variables: { chat_session_id },
        fetchPolicy: "no-cache", //? Ensure we get the latest messages
      });
    const previousMessages = messagesData.chat_sessions.messages;

    const formattedPreviousMessages: ChatCompletionMessageParam[] =
      previousMessages.map((msg) => ({
        role: msg.sender === "ai" ? "system" : "user",
        name: msg.sender === "ai" ? "system" : name,
        content: msg.content,
      }));

    //* Step 3: Combine characteristics into a system prompt
    const systemPrompt = chatbot.chatbot_characteristics
      .map((characteristic) => characteristic.content)
      .join(" + ");

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        name: "system",
        content: `You are a helpful assistant talking to ${name}.
         If a generic question is asked which is not relevant or in the same scope or domain as the points in mentioned in the key information section, kindly inform the user they're only allowed to search for the specified content.
          Use Emoji's where possible. Here is some key information that you need to be aware of, there are elements you may be asked about: ${systemPrompt}`,
      },
      ...formattedPreviousMessages,
      {
        role: "user",
        name: name,
        content: content,
      },
    ];

    //* Step 4: Send the message to OpenAI's completions API
    const openaiResponse = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-4o",
    });

    const aiResponse = openaiResponse?.choices?.[0]?.message?.content?.trim();
    if (!aiResponse) {
      return NextResponse.json(
        { error: "Failed to generate AI response" },
        { status: 500 }
      );
    }

    //* Step 5: Save the user's message to the database
    await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        content,
        sender: "user",
      },
    });

    //* Step 6: Save the AI's response to the database
    const aiMessageResult = await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        content: aiResponse,
        sender: "ai",
      },
    });

    //* Step 7: Return the AI's response to the client
    return NextResponse.json({
      id: aiMessageResult.data.insertMessages.id,
      content: aiResponse,
    });
  } catch (e) {
    console.error("Error sending message:", e);
    return NextResponse.json({ e }, { status: 500 });
  }
};
