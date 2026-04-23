"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Send, Paperclip } from "lucide-react";
import { useSetAtom, useAtom, useAtomValue } from "jotai";
import { toggleState } from "@/states/ContactsPane";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { getRelativeTimeFormat } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { contactUserAtom, messageHistoryAtom } from "@/states/Chat";
import { userAtom } from "@/states/User";

export default function Chat() {
  const params = useParams();
  const setContact = useSetAtom(contactUserAtom);
  const setMessageHistory = useSetAtom(messageHistoryAtom);

  async function getContactInfo() {
    const response = await fetch(`/api/contacts?contactId=${params.id}`);
    const responseBody = await response.json();
    setContact(responseBody.contacts[0]);
  }

  async function getMessages() {
    const response = await fetch(`/api/messages?contactId=${params.id}`);
    const responseBody = await response.json();
    setMessageHistory(responseBody.messages);
  }

  useEffect(() => {
    getContactInfo();
    getMessages();
  }, []);

  return (
    <div className="w-full h-full grid grid-cols-1 grid-rows-[max-content_1fr_max-content] overflow-hidden">
      <TopPane></TopPane>
      <MessagePane></MessagePane>
      <ChatBar></ChatBar>
    </div>
  );
}

function TopPane() {
  let setTs = useSetAtom(toggleState);
  const contact = useAtomValue(contactUserAtom);
  return (
    <div className="h-16 border-b-2 overflow-hidden flex items-center gap-4 py-3 px-5">
      <Button
        onClick={(ev) => {
          ev.preventDefault();
          setTs((state) => !state);
        }}
        variant={"outline"}
        size={"icon-sm"}
        className="size-6 md:hidden"
      >
        <ChevronLeft />
      </Button>
      <Avatar size="lg">
        <AvatarImage src={contact?.image ?? ""} className="rounded-full" />
        <AvatarFallback>AO</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-md font-semibold">{contact?.name}</h2>
        <p className="text-xs">{contact?.email}</p>
      </div>
    </div>
  );
}

function ChatBar() {
  const params = useParams();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const setMessageHistory = useSetAtom(messageHistoryAtom);
  const user = useAtomValue(userAtom);

  async function sendMessage() {
    if (!message.trim() || sending) return;
    setSending(true);
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: params.id, message }),
    });
    if (response.ok) {
      const res = await response.json();
      setMessageHistory((prev: any[]) => [...prev, {
        sender: { id: user?.id },
        reciever: { id: params.id },
        message: message,
        createdAt: new Date()
      }]);
      setMessage("");
    }
    setSending(false);
  }

  return (
    <div className="h-16 border-t-2 overflow-hidden flex gap-2 py-3 px-3">
      <Button size={"icon"}>
        <Paperclip></Paperclip>
      </Button>
      <InputGroup>
        <InputGroupInput
          type="message"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
      </InputGroup>
      <Button onClick={sendMessage} disabled={sending}>
        <Send></Send>
        Send
      </Button>
    </div>
  );
}

function MessagePane() {
  const messages = useAtomValue(messageHistoryAtom);
  const contactUser = useAtomValue(contactUserAtom);

  return (
    <div className="overflow-auto flex flex-col p-4">
      {messages.map((ax, idx) => {
        return (
          <div
            key={idx}
            className={[
              "flex w-full mb-4 first:mb-0",
              ax.sender.id === contactUser?.id ? "" : "justify-end-safe",
            ].join(" ")}
          >
            <div
              className={[
                "w-10/12 md:w-4/12 p-3 rounded-lg",
                ax.sender.id === contactUser?.id
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-accent-foreground text-accent",
              ].join(" ")}
            >
              <p>{ax.message}</p>
              <p className="italic text-right text-xs">
                {getRelativeTimeFormat(new Date(ax.createdAt))}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
