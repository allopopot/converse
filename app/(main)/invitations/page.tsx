"use client";

import {
  Check,
  Clock,
  Copy,
  LoaderPinwheel,
  MailPlus,
  Send,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Invitation {
  id: string;
  email: string;
  name?: string;
  status: "pending" | "accepted" | "rejected";
  sentAt: Date;
}

export default function InvitationsPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: "1",
      email: "john@example.com",
      status: "pending",
      sentAt: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      email: "jane@example.com",
      status: "accepted",
      name: "Jane Doe",
      sentAt: new Date(Date.now() - 172800000),
    },
  ]);

  const userId = "user-123";

  const handleSendInvite = async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setInvitations((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          email,
          status: "pending",
          sentAt: new Date(),
        },
      ]);
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/invite/${userId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendInvite()}
              className="flex-1"
            />
            <Button
              onClick={handleSendInvite}
              disabled={!email.trim() || isLoading}
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
          </div>
        </div>

        {/* <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="size-5" />
            Share Link
          </h2>
          <p className="text-sm text-muted-foreground">
            Share your unique invitation link with anyone
          </p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/invite/${userId}`}
              className="flex-1 bg-muted"
            />
            <Button variant="outline" onClick={copyInviteLink}>
              {copied ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div> */}

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="size-5" />
            Sent Invitations
          </h2>
          {invitations.length === 0 ? (
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
                    <Avatar size="sm">
                      <AvatarFallback>
                        {invite.name?.[0] || invite.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {invite.name || invite.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {invite.email}
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
