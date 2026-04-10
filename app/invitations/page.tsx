"use client";

import { useSetAtom } from "jotai";
import { ChevronLeft, Mail, Search, Trash2, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toggleState } from "@/states/ContactsPane";

export default function InvitationsPage() {
  const setToggle = useSetAtom(toggleState);

  const sampleInvitations = [
    {
      id: "1",
      email: "john@example.com",
      name: "John Doe",
      status: "pending",
      sentAt: new Date(),
    },
    {
      id: "2",
      email: "jane@example.com",
      name: "Jane Smith",
      status: "pending",
      sentAt: new Date(),
    },
  ];

  return (
    <div className="w-full h-full grid grid-cols-1 grid-rows-[max-content_1fr] overflow-hidden">
      <TopPane onBack={() => setToggle(true)} />
      <InvitationsList invitations={sampleInvitations} />
    </div>
  );
}

function TopPane({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-16 border-b-2 overflow-hidden flex items-center gap-4 py-3 px-5">
      <Button
        onClick={(ev) => {
          ev.preventDefault();
          onBack();
        }}
        variant={"outline"}
        size={"icon-sm"}
        className="size-6 md:hidden"
      >
        <ChevronLeft />
      </Button>
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Invitations</h2>
      </div>
    </div>
  );
}

function InvitationsList({
  invitations,
}: {
  invitations: {
    id: string;
    email: string;
    name: string;
    status: string;
    sentAt: Date;
  }[];
}) {
  return (
    <div className="overflow-auto p-4">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Pending Invitations (Incoming)
        </h3>
        {invitations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No pending invitations
          </p>
        ) : (
          <div className="space-y-3">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-background"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {inv.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{inv.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Sent {inv.sentAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="default">
                    Accept
                  </Button>
                  <Button size="sm" variant="outline">
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Send New Invitation
        </h3>
        <div className="flex gap-2">
          <InputGroup className="flex-1">
            <InputGroupInput type="email" placeholder="Enter email address" />
          </InputGroup>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite
          </Button>
        </div>
      </div>
    </div>
  );
}
