"use client";

import Link from "next/link";
import { FC, FormEvent, use, useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components";
import { Characteristic } from "../_components/Characteristic";
import { BASE_URL } from "@/lib/graphql/apolloClient";
import { IPageParams } from "@/types/Common.type";
import {
  IGetChatbotByIdResponse,
  IGetChatbotByIdVariables,
} from "@/types/Chatbot.type";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHATBOT_BY_ID } from "@/lib/graphql/queries";
import { ADD_CHARACTERISTIC, DELETE_CHATBOT, UPDATE_CHATBOT } from "@/lib/graphql/mutations";
import { redirect } from "next/navigation";

const EditChatbot: FC<IPageParams<{ id: string }>> = ({ params }) => {
  const [url, setUrl] = useState<string>("");
  const [chatbotName, setChatbotName] = useState<string>("");
  const [newCharacteristic, setNewCharacteristic] = useState<string>("");

  const { id } = use(params);

  const [addCharacteristic] = useMutation(ADD_CHARACTERISTIC, {
    refetchQueries: [GET_CHATBOT_BY_ID],
  });
  const [updateChatbot] = useMutation(UPDATE_CHATBOT, {
    refetchQueries: [GET_CHATBOT_BY_ID],
  });
  const [deleteChatbot] = useMutation(DELETE_CHATBOT, {
    refetchQueries: [GET_CHATBOT_BY_ID], //? refetch the query after deletion
    awaitRefetchQueries: true,
  });

  const { data, loading, error } = useQuery<
    IGetChatbotByIdResponse,
    IGetChatbotByIdVariables
  >(GET_CHATBOT_BY_ID, { variables: { id } });

  useEffect(() => {
    if (data) {
      setChatbotName(data.chatbots.name);
    }
  }, [data]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard");
  };

  useEffect(() => {
    const url = `${BASE_URL}/chatbot/${id}`;

    setUrl(url);
  }, [id]);

    const handleAddCharacteristic = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const promise = addCharacteristic({
        variables: {
          chatbotId: Number(id),
          content: newCharacteristic,
        },
      });
      toast.promise(promise, {
        loading: "Adding...",
        success: "Characteristic added",
        error: "Failed to add characteristic",
      });
    } catch (e) {
      console.error("Failed to add characteristic: ", e);
    } finally {
      setNewCharacteristic("");
    }
  };

  const handleUpdateChatbot = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const promise = updateChatbot({
            variables: {
                id,
                name: chatbotName,
            }
        })
        toast.promise(promise, {
            loading: "Updating...",
            success: "Chatbot updated successfully updated!",
            error: "Failed to update chatbot",
        });
    } catch (e) {
        console.error("Failed to update chatbot: ", e);
    }

  };

  const handleDeleteChatbot = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this chatbot?"
    );
    if (!isConfirmed) return;
    try {
      const promise = deleteChatbot({ variables: { id } });
      toast.promise(promise, {
        loading: "Deleting...",
        success: "Chatbot Successfully deleted!",
        error: "Failed to delete chatbot",
      });
    } catch (e) {
      console.error("Error deleting chatbot: ", e);
      toast.error("Failed to delete chatbot");
    }
  };

  if (loading)
    return (
      <div className="mx-auto animate-spin p-10">
        <Avatar seed="AI Agent" />
      </div>
    );

  if (error) return <p>Error: {error.message}</p>;

  if (!data?.chatbots) return redirect("/view-chatbots");

  return (
    <div className="px-0 md:p-10">
      <div className="md:sticky md:top-0 z-50 sm:max-w-sm ml-auto space-y-2 md:border p-5 rounded-b-lg md:rounded-lg bg-[#2991EE]">
        <h2 className="text-white text-sm font-bold">Link to Chat</h2>
        <p className="text-sm italic text-white">
          Share this link with your customers to start conversations with your
          chatbot.
        </p>
        <div className="flex items-center space-x-2">
          <Link href={url} className="w-full cursor-pointer hover:opacity-50">
            <Input value={url} readOnly className="cursor-pointer bg-white" />
          </Link>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={handleCopyUrl}
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <section className="relative mt-5 bg-white p-5 md:p-10 rounded-lg">
        <Button
          variant="destructive"
          onClick={handleDeleteChatbot}
          className="absolute top-2 right-2 h-8 w-2"
        >
          X
        </Button>
        <div className="flex space-x-4">
          <Avatar seed={chatbotName} />
          <form
            onSubmit={handleUpdateChatbot}
            className="flex flex-auto space-x-2 items-center"
          >
            <Input
              value={chatbotName}
              onChange={(e) => setChatbotName(e.target.value)}
              placeholder={chatbotName}
              className="w-full border-none bg-transparent text-xl font-bold"
              required
            />
            <Button type="submit" disabled={!chatbotName}>
              Update
            </Button>
          </form>
        </div>
        <h2 className="text-xl font-bold mt-10">Heres what your AI knows...</h2>
        <p>
          Your chatbot is equipped with the following information to assist you
          in your conversations with your customers & users
        </p>
        <div className="bg-gray-100 p-5 rounded-md mt-5">
          <form
            onSubmit={handleAddCharacteristic}
            className="flex space-x-2 mb-5"
          >
            <Input
              type="text"
              placeholder="Example: If customer asks for prices, provide pricing page: www.example.com/pricing"
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
            />
            <Button type="submit" disabled={!newCharacteristic}>
              Add
            </Button>
          </form>
          <ul className="flex flex-wrap-reverse gap-6">
            {data?.chatbots.chatbot_characteristics.map((characteristic) => (
              <Characteristic key={characteristic.id} {...characteristic} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default EditChatbot;
