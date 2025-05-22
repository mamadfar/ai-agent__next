"use client";

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
import startNewChat from "@/lib/startNewChat";
import { IPageParams } from "@/types/Common.type";
import { FC, use, useState } from "react";

const Chatbot: FC<IPageParams<{ id: string }>> = ({ params }) => {
  const { id } = use(params);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [chatId, setChatId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<any[]>([]);

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

  return (
    <div className="w-full flex bg-gray-100">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* <DialogTrigger>Open</DialogTrigger> */}
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
    </div>
  );
};

export default Chatbot;
