"use client";

import { FC } from "react";
import { IChatbotCharacteristic } from "@/types/Chatbot.type";
import { CircleX } from "lucide-react";
import { useMutation } from "@apollo/client";
import { REMOVE_CHARACTERISTIC } from "@/lib/graphql/mutations";
import { GET_CHATBOT_BY_ID } from "@/lib/graphql/queries";
import { toast } from "sonner";

export const Characteristic: FC<IChatbotCharacteristic> = ({ content, id }) => {
  const [removeCharacteristic] = useMutation(REMOVE_CHARACTERISTIC, {
    refetchQueries: [GET_CHATBOT_BY_ID],
  });

  const handleRemoveCharacteristic = () => {
    const removeCharacteristicPromise = async () => {
      try {
        await removeCharacteristic({
          variables: { characteristicId: id },
        });
      } catch (e) {
        console.error(e);
      }
    };
    toast.promise(removeCharacteristicPromise, {
      loading: "Removing...",
      success: "Characteristic removed",
      error: "Failed to remove characteristic",
    });
  };

  return (
    <li key={id} className="relative p-10 bg-white rounded-md">
      {content}
      <CircleX
        className="w-6 h-6 text-white fill-red-500 absolute top-1 right-1 cursor-pointer hover:opacity-50"
        onClick={handleRemoveCharacteristic}
      />
    </li>
  );
};
