"use client";

import { FC, use, useEffect, useState } from "react";
import { Avatar, Messages } from "@/components";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/lib/graphql/queries";
import startNewChat from "@/lib/startNewChat";
import {
  IGetChatbotByIdResponse,
  IMessagesByChatSessionIdResponse,
  IMessagesByChatSessionIdVariables,
} from "@/types/Chatbot.type";
import { IPageParams } from "@/types/Common.type";
import { IMessage } from "@/types/Message.type";
import { useQuery } from "@apollo/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const messageSchema = z.object({
  message: z.string().min(2, "Your message is too short!"),
});

const Chatbot: FC<IPageParams<{ id: string }>> = ({ params }) => {
  const { id } = use(params);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [chatId, setChatId] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const { data: chatBotData } = useQuery<IGetChatbotByIdResponse>(
    GET_CHATBOT_BY_ID,
    {
      variables: { id: Number(id) },
    }
  );

  const {
    loading: loadingQuery,
    error,
    data,
  } = useQuery<
    IMessagesByChatSessionIdResponse,
    IMessagesByChatSessionIdVariables
  >(GET_MESSAGES_BY_CHAT_SESSION_ID, {
    variables: { chat_session_id: chatId! },
    skip: !chatId, //* Skip the query if chatId is not set
  });

  const handleInformationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const chatId = await startNewChat(name, email, Number(id));
      setChatId(chatId);
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    const {message: formMessage} = values;
    const message = formMessage;
    form.reset();

    if (!name || !email || !chatId) {
      setIsOpen(true);
      setIsLoading(false);
      return;
    }
    if (!message.trim()) return; // Prevent sending empty messages
    
    // Optimistically update the UI with the user's message
    const userMessage: IMessage = {
      id: Date.now(),
      content: message,
      created_at: new Date().toISOString(),
      chat_session_id: chatId,
      sender: "user",
    }
    // ...And show loading state for AI response
    const loadingMessage: IMessage = {
      id: Date.now() + 1,
      content: "Thinking...",
      created_at: new Date().toISOString(),
      chat_session_id: chatId,
      sender: "ai",
    }

    setMessages(prevMsg => [...prevMsg, userMessage, loadingMessage]);

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          chat_session_id: chatId,
          chatbot_id: id,
          content: message
        })
      });
      const result = await response.json();
      setMessages(prevMsg => (
        prevMsg.map(msg => (
          msg.id === loadingMessage.id ? {...msg, content: result.message, id: result.id} : msg
        ))
      ))
    } catch (e) {
      console.error("Error sending message:", e);
      
    }
  }

  useEffect(() => {
    if (data) {
      setMessages(data.chat_sessions.messages);
    }
  }, [data]);

  return (
    <div className="w-full flex bg-gray-100">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleInformationSubmit} className="">
            <DialogHeader>
              <DialogTitle>Lets help you out!</DialogTitle>
              <DialogDescription>
                I just need a few details to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter your name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!name || !email || isLoading}>
                {isLoading ? "Loading..." : "Continue"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-10">
        <div className="pb-4 border-b sticky top-0 z-50 bg-[#4D7DFB] py-5 px-10 text-white md:rounded-t-lg flex items-center space-x-4">
          <Avatar
            seed={chatBotData?.chatbots.name!}
            className="h-12 w-12 bg-white rounded-full border-2 border-white"
          />
          <div>
            <h1 className="truncate text-lg">{chatBotData?.chatbots.name}</h1>
            <p className="text-sm text-gray-300">
              ⚡Typically replies Instantly
            </p>
          </div>
        </div>
        <Messages
          messages={messages}
          chatbotName={chatBotData?.chatbots.name!}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start sticky bottom-0 z-50 space-x-4 drop-shadow-lg p-4 bg-gray-100 rounded-md mt-auto">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel hidden>Message</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type a message..."
                      {...field}
                      className="p-8"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid} className="h-full">
              Send
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Chatbot;
