"use client";

import { Clock, LoaderPinwheel, MailPlus, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Invitation {
    id: string;
    email: string;
    name?: string;
    status: "pending" | "accepted" | "rejected";
    sentAt: Date;
}

interface Contact {
    id: string;
    name: string;
    email: string;
    image?: string;
}

interface SentInvitation {
    id: string;
    inviteeId: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    inviteeName: string | null;
    inviteeEmail: string | null;
    inviteeImage: string | null;
}

export default function InvitationsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [invitations, setInvitations] = useState<SentInvitation[]>([]);
    const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const res = await fetch("/api/invitation");
                if (res.ok) {
                    const data = await res.json();
                    setInvitations(data);
                }
            } catch (error) {
                console.error("Failed to fetch invitations:", error);
            } finally {
                setIsLoadingInvitations(false);
            }
        };
        fetchInvitations();
    }, []);

    const handleSendInvite = async () => {
        if (!selectedContact) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/invitation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inviteeId: selectedContact.id }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || "Failed to send invitation");
                setIsLoading(false);
                return;
            }
            setInvitations((prev) => [data, ...prev]);
            setSelectedContact(null);
            setSearchQuery("");
            setContacts([]);
        } catch (error) {
            console.error("Failed to send invitation:", error);
            alert("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const searchContacts = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setContacts([]);
            return;
        }
        setIsSearching(true);
        try {
            const res = await fetch(`/api/contact?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setContacts(data);
        } catch (error) {
            console.error("Failed to search contacts:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const selectContact = (contact: Contact) => {
        setSelectedContact(contact);
        setSearchQuery(contact.name);
        setContacts([]);
    };

    return (
        <div className="w-full h-full bg-background p-6 overflow-auto">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Invite Contacts</h1>
                    <p className="text-muted-foreground">
                        Invite others to connect with you
                    </p>
                </div>

                <div className="bg-card border rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <MailPlus className="size-5" />
                        Send Invitation
                    </h2>
                    <div className="relative flex gap-2">
                        <Input
                            type="text"
                            placeholder="Search by name or email"
                            value={searchQuery}
                            onChange={(e) => searchContacts(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendInvite()}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSendInvite}
                            disabled={!selectedContact || isLoading}
                        >
                            {isLoading ? (
                                <LoaderPinwheel className="animate-spin size-4" />
                            ) : (
                                <>
                                    <Send className="size-4" />
                                    Send
                                </>
                            )}
                        </Button>
                        {contacts.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                                {contacts.map((contact) => (
                                    <div
                                        key={contact.id}
                                        onClick={() => selectContact(contact)}
                                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted"
                                    >
                                        <Avatar size="sm">
                                            <AvatarFallback>
                                                {contact.name[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{contact.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {contact.email}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-card border rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Clock className="size-5" />
                        Sent Invitations
                    </h2>
                    {isLoadingInvitations ? (
                        <div className="flex justify-center py-8">
                            <LoaderPinwheel className="animate-spin size-6" />
                        </div>
                    ) : invitations.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            No invitations sent yet
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {invitations.map((invite) => (
                                <div
                                    key={invite.id}
                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={invite.inviteeImage ?? ""} ></AvatarImage>
                                            <AvatarFallback>
                                                {invite.inviteeName?.[0] ||
                                                    invite.inviteeEmail?.[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">
                                                {invite.inviteeName || invite.inviteeEmail}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {invite.inviteeEmail}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${invite.status === "accepted"
                                            ? "bg-green-500/10 text-green-500"
                                            : invite.status === "rejected"
                                                ? "bg-red-500/10 text-red-500"
                                                : "bg-yellow-500/10 text-yellow-500"
                                            }`}
                                    >
                                        {invite.status.charAt(0).toUpperCase() +
                                            invite.status.slice(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
