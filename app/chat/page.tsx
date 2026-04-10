"use client"

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Send, Paperclip } from "lucide-react"
import { useSetAtom } from "jotai"
import { toggleState } from "@/states/ContactsPane"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { getRelativeTimeFormat } from "@/utils/format";

export default function Chat() {
    return (
        <div className="w-full h-full grid grid-cols-1 grid-rows-[max-content_1fr_max-content] overflow-hidden">
            <TopPane></TopPane>
            <MessagePane></MessagePane>
            <ChatBar></ChatBar>
        </div>
    )
}

function TopPane() {
    let setTs = useSetAtom(toggleState)
    return (
        <div className="h-16 border-b-2 overflow-hidden flex items-center gap-4 py-3 px-5">
            <Button onClick={(ev) => {
                ev.preventDefault()
                setTs((state) => !state)
            }} variant={"outline"} size={"icon-sm"} className="size-6 md:hidden">
                <ChevronLeft />
            </Button>
            <Avatar size="lg">
                <AvatarImage src="https://www.w3schools.com/howto/img_avatar2.png" className="rounded-full" />
                <AvatarFallback>AO</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="text-md font-semibold">Alva Operator</h2>
                <p className="text-xs">alva@email.com</p>
            </div>
        </div>
    )
}

function ChatBar() {
    return (
        <div className="h-16 border-t-2 overflow-hidden flex gap-2 py-3 px-3">
            <Button size={"icon"}>
                <Paperclip></Paperclip>
            </Button>
            <InputGroup>
                <InputGroupInput type="message" placeholder="Send a message" />
            </InputGroup>
            <Button>
                <Send></Send>
                Send
            </Button>
        </div>
    )
}

function MessagePane() {

    let sampleMessages = [
        {
            direction: "send",
            message: "Hey mate wazzup?",
            time: new Date("2026-01-01")
        },
        {
            direction: "recieve",
            message: "Hello there mate!",
            time: new Date("2026-01-01")
        },
    ]

    return (
        <div className="overflow-auto flex flex-col-reverse p-4">
            {
                sampleMessages.map((ax, idx) => {
                    return (
                        <div key={idx} className={["flex w-full mb-4 first:mb-0", (ax.direction === "send" ? "justify-end-safe" : "")].join(" ")}>
                            <div className={["w-10/12 md:w-4/12 p-3 rounded-lg", (ax.direction === "send" ? "bg-secondary text-secondary-foreground" : "bg-accent-foreground text-accent")].join(" ")} >
                                <p>{ax.message}</p>
                                <p className="italic text-right text-xs">{getRelativeTimeFormat(ax.time)}</p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
