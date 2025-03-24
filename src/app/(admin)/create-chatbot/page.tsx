import React from 'react';
import Avatar from "@components/common/Avatar";
import {Input} from "@components/ui/input";
import {Button} from "@components/ui/button";

const CreateChatbot = () => {
    return (
        <div
            className="flex flex-col items-center justify-center md:flex-row md:space-x-10 bg-white p-10 rounded-md m-10">
            <Avatar seed="create-chatbot"/>
            <div className="">
                <h1 className="text-xl lg:text-3xl font-semibold">Create</h1>
                <h2 className="font-light">
                    Create a new chatbot to assist you in your conversations with your customers.
                </h2>
                <form action="" className="flex flex-col md:flex-row gap-2 mt-5">
                    <Input placeholder="Chatbot Name..." className="max-w-lg" required/>
                    <Button>Create Chatbot</Button>
                </form>
            </div>
        </div>
    );
};

export default CreateChatbot;
