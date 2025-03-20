import React from 'react';
import Link from "next/link";
import {BotMessageSquare, PencilLine, SearchIcon} from "lucide-react";

const Sidebar = () => {
    return (
        <div className="bg-white text-white p-5">
            <ul className="gap-5 flex lg:flex-col">
                <li className="flex-auto">
                    <Link href="/create-chatbot"
                          className="flex flex-col lg:flex-row items-center gap-2 p-5 rounded-md bg-[#2991EE] text-center lg:text-left hover:opacity-50">
                        <BotMessageSquare className="h6 w-6 lg:h-8 lg:w-8"/>
                        <div className="hidden md:inline">
                            <p className="text-xl">Create</p>
                            <p className="text-sm font-extralight">New Chatbot</p>
                        </div>
                    </Link>
                </li>
                <li className="flex-auto">
                    <Link href="view-chatbots"
                          className="flex flex-col lg:flex-row items-center gap-2 p-5 rounded-md bg-[#2991EE] text-center lg:text-left hover:opacity-50">
                        <PencilLine className="h6 w-6 lg:h-8 lg:w-8"/>
                        <div className="hidden md:inline">
                            <p className="text-xl">Edit</p>
                            <p className="text-sm font-extralight">Chatbots</p>
                        </div>
                    </Link>
                </li>
                <li className="flex-auto">
                    <Link href="/review-sessions"
                          className="flex flex-col lg:flex-row items-center gap-2 p-5 rounded-md bg-[#2991EE] text-center lg:text-left hover:opacity-50">
                        <SearchIcon className="h6 w-6 lg:h-8 lg:w-8"/>
                        <div className="hidden md:inline">
                            <p className="text-xl">View</p>
                            <p className="text-sm font-extralight">Sessions</p>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
