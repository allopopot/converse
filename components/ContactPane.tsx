"use client";

import { useAtomValue, useSetAtom } from "jotai";
import {
  EllipsisVertical,
  LoaderPinwheel,
  Mailbox,
  MailPlus,
  Plus,
  Search,
  LogOut,
  Menu
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type Contact,
  contactsAtom,
  contactsHasMoreAtom,
  contactsLoadingAtom,
  contactsPageAtom,
  contactsSearchQueryAtom,
  contactsTotalAtom,
} from "@/states/Contacts";
import { toggleState } from "@/states/ContactsPane";
import { userAtom, userLoadingAtom } from "@/states/User";
import { Button } from "./ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { authClient } from "@/lib/auth-client";

export default function ContactsPane() {
  const ts = useAtomValue(toggleState);
  return (
    <div
      className={[
        "w-full md:w-80 shadow-md z-5 overflow-auto h-full absolute md:static bg-background",
        ts ? "left-0" : "-left-full",
      ].join(" ")}
    >
      <SelfInfoPane></SelfInfoPane>
      <ContactsSearchPane></ContactsSearchPane>
      <ContactsListPane></ContactsListPane>
    </div>
  );
}

function SelfInfoPane() {
  const user = useAtomValue(userAtom);
  const userLoading = useAtomValue(userLoadingAtom);
  return (
    <div className="w-full p-4 flex flex-row flex-nowrap gap-4 items-center pb-4 border-b-2 sticky top-0 bg-background">
      <Avatar className="size-16">
        <AvatarImage src={user?.image ?? ""} className="rounded-full" />
        <AvatarFallback>
          <LoaderPinwheel className="animate-spin"></LoaderPinwheel>
        </AvatarFallback>
      </Avatar>
      <div>
        {userLoading ? <p>Loading...</p> : null}
        <h2 className="text-xl font-semibold">{user?.name}</h2>
        <p>{user?.email}</p>
      </div>
    </div>
  );
}

function ContactsSearchPane() {
  const searchQuery = useAtomValue(contactsSearchQueryAtom);
  const setSearchQuery = useSetAtom(contactsSearchQueryAtom);
  const router = useRouter();

  return (
    <div className="p-4 sticky top-0 bg-background">
      <div className="flex justify-between items-center-safe mb-2">
        <h2 className="text-xl font-semibold ">Contacts</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size={"icon-sm"}>
              <Menu></Menu>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/invitations")}
              >
                <MailPlus></MailPlus>
                Invitations
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={async () => {
                await authClient.signOut()
                router.replace("/")
              }}>
                <LogOut></LogOut>
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <InputGroup className="mb-2">
        <InputGroupInput
          placeholder="Search by Email Address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>
            <Search></Search>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function ContactsListPane() {
  const contacts = useAtomValue(contactsAtom);
  const loading = useAtomValue(contactsLoadingAtom);
  const searchQuery = useAtomValue(contactsSearchQueryAtom);
  const setContacts = useSetAtom(contactsAtom);
  const setLoading = useSetAtom(contactsLoadingAtom);
  const setTs = useSetAtom(toggleState);
  const router = useRouter();

  const fetchContacts = useCallback(
    async (query: string = "") => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.append("q", query);
        params.append("limit", "50");

        const response = await fetch(`/api/contacts?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }

        const data = await response.json();
        setContacts(data.contacts || []);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    },
    [setContacts, setLoading],
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchContacts(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchContacts]);

  const handleContactClick = (contactId: string) => {
    setTs(false);
    router.push(`/chat?contact=${contactId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoaderPinwheel className="animate-spin h-6 w-6" />
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No contacts found</p>
        {searchQuery && (
          <p className="text-sm mt-2">Try adjusting your search</p>
        )}
      </div>
    );
  }

  return (
    <div className="contents">
      {contacts.map((contact) => (
        <ContactItem
          key={contact.id}
          contact={contact}
          onClick={() => handleContactClick(contact.id)}
          onToggleSidebar={() => setTs(false)}
        />
      ))}
    </div>
  );
}

function ContactItem({
  contact,
  onClick,
  onToggleSidebar,
}: {
  contact: Contact;
  onClick: () => void;
  onToggleSidebar: () => void;
}) {
  return (
    <div className="w-full p-4 flex flex-row flex-nowrap gap-4 items-center pb-4 border-t-2 bg-background group hover:bg-muted/50 transition-colors">
      <Avatar className="size-12 cursor-pointer" onClick={onClick}>
        <AvatarImage src={contact.image || ""} className="rounded-full" />
        <AvatarFallback>
          {contact.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <button
        type="button"
        className="w-full text-left cursor-pointer border-none bg-transparent p-0 hover:bg-transparent focus:outline-none"
        onClick={onClick}
      >
        <h2 className="text-md font-semibold group-hover:underline underline-offset-2">
          {contact.name}
        </h2>
        <p className="text-xs text-muted-foreground">{contact.email}</p>
      </button>
      <div className="w-min">
        <Button variant={"ghost"} size="sm">
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
