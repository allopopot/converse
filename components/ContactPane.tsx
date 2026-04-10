"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "./ui/input-group"
import { Search, EllipsisVertical, Plus, PersonStanding, Mailbox, MailPlus } from "lucide-react"
import { Button } from "./ui/button"
import { useAtomValue } from 'jotai'
import { toggleState } from "@/states/ContactsPane"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export default function ContactsPane() {
    let ts = useAtomValue(toggleState)
    return (
        <div className={["w-full md:w-80 shadow-md z-5 overflow-auto h-full absolute md:static bg-white", (ts ? "left-0" : "-left-full")].join(" ")}>
            <SelfInfoPane></SelfInfoPane>
            <ContactsSearchPane></ContactsSearchPane>
            <ContactsListPane></ContactsListPane>
        </div>
    )
}

function SelfInfoPane() {
    return (
        <div className="w-full p-4 flex flex-row flex-nowrap gap-4 items-center pb-4 border-b-2 sticky top-0 bg-white">
            <Avatar className="size-16">
                <AvatarImage src="https://www.w3schools.com/howto/img_avatar2.png" className="rounded-full" />
                <AvatarFallback>AO</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="text-xl font-semibold">Alva Operator</h2>
                <p>alva@email.com</p>
            </div>
        </div>
    )
}

function ContactsSearchPane() {
    return (
        <div className="p-4 sticky top-0 bg-white">
            <div className="flex justify-between items-center-safe mb-2">
                <h2 className="text-xl font-semibold ">Contacts</h2>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size={"icon-sm"}>
                            <Plus></Plus>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <MailPlus></MailPlus>
                                Send an Invite
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Mailbox></Mailbox>
                                Invitations
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
            <InputGroup className="mb-2">
                <InputGroupInput placeholder="Search by Email Address" />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton>
                        <Search></Search>
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
}


function ContactsListPane() {
    return (
        <div className="contents">
            <div className="w-full p-4 flex flex-row flex-nowrap gap-4 items-center pb-4 border-t-2 bg-white">
                <Avatar size="lg">
                    <AvatarImage src="https://www.w3schools.com/howto/img_avatar2.png" className="rounded-full" />
                    <AvatarFallback>AO</AvatarFallback>
                </Avatar>
                <div className="w-full">
                    <h2 className="text-md font-semibold">Alva Operator</h2>
                    <p className="text-xs">alva@email.com</p>
                </div>
                <div className="w-min">
                    <Button variant={"link"}>
                        <EllipsisVertical></EllipsisVertical>
                    </Button>
                </div>
            </div>
        </div>
    )
}