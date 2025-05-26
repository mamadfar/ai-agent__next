"use client";

import {FormEvent, useState} from 'react';
import Avatar from "@components/common/Avatar";
import {Input} from "@components/ui/input";
import {Button} from "@components/ui/button";
import {useMutation} from "@apollo/client";
import {CREATE_CHATBOT} from "@/lib/graphql/mutations";
import {useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import { IInsertChatbot } from '@/types/Chatbot.type';

const CreateChatbot = () => {

    const [name, setName] = useState<string>("")

    const router = useRouter()
    const {user} = useUser()

    const [createChatbotMutation, {loading, error}] = useMutation<IInsertChatbot>(CREATE_CHATBOT, {
        variables: {
            clerk_user_id: user?.id,
            name
        }
    })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const {data} = await createChatbotMutation()
            setName("")
            router.push(`/edit-chatbot/${data?.insertChatbots.id}`)
        } catch (e) {
            console.error(e)
        }
    }

    if (!user || error) return null

    return (
        <div
            className="flex flex-col items-center justify-center md:flex-row md:space-x-10 bg-white p-10 rounded-md m-10">
            <Avatar seed="create-chatbot"/>
            <div className="">
                <h1 className="text-xl lg:text-3xl font-semibold">Create</h1>
                <h2 className="font-light">
                    Create a new chatbot to assist you in your conversations with your customers.
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 mt-5">
                    <Input placeholder="Chatbot Name..." value={name} onChange={e => setName(e.target.value)} className="max-w-lg" required/>
                    <Button type="submit" disabled={loading || !name}>
                        {loading ? "Creating..." : "Create Chatbot"}
                    </Button>
                </form>
                <p className="text-gray-300 mt-5">Example: Customer Support Chatbot</p>
            </div>
        </div>
    );
};

export default CreateChatbot;
