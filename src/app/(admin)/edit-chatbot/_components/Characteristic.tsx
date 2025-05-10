"use client";

import { FC, MouseEvent } from "react";
import { IChatbotCharacteristic } from "@/types/Chatbot.type";
import { OctagonX } from "lucide-react";
import { useMutation } from "@apollo/client";
import { REMOVE_CHARACTERISTIC } from "@/lib/graphql/mutations";
import { GET_CHATBOT_BY_ID } from "@/lib/graphql/queries";
import { toast } from "sonner";

export const Characteristic: FC<IChatbotCharacteristic> = ({ content, id }) => {
  const [removeCharacteristic] = useMutation(REMOVE_CHARACTERISTIC, {
    refetchQueries: [{ query: GET_CHATBOT_BY_ID }], // Todo: fix the refetch query
  });

  const handleRemoveCharacteristic = (e: MouseEvent<SVGElement>) => {
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
    <li className="relative p-10 bg-white rounded-md">
      {content}
      <OctagonX
        className="w-6 h-6 text-white fill-red-500 absolute top-1 right-1 cursor-pointer hover:opacity-50"
        onClick={handleRemoveCharacteristic}
      />
    </li>
  );
};
