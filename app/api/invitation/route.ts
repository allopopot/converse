import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { invitation, user } from "@/lib/schema";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const pendingInvitations = await db
      .select({
        id: invitation.id,
        inviterId: invitation.inviterId,
        inviteeId: invitation.inviteeId,
        status: invitation.status,
        createdAt: invitation.createdAt,
        updatedAt: invitation.updatedAt,
        inviteeName: user.name,
        inviteeEmail: user.email,
        inviteeImage: user.image
      })
      .from(invitation)
      .innerJoin(user, eq(invitation.inviteeId, user.id))
      .where(
        and(
          eq(invitation.inviterId, session.user.id),
          eq(invitation.status, "pending"),
        ),
      )
      .orderBy(invitation.createdAt);

    return NextResponse.json(pendingInvitations);
  } catch (error) {
    console.error("Error fetching pending invitations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { inviteeId } = await request.json();

    if (!inviteeId || typeof inviteeId !== "string") {
      return NextResponse.json(
        { error: "inviteeId is required and must be a string" },
        { status: 400 },
      );
    }

    // Check if invitee exists
    const [invitee] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, inviteeId))
      .limit(1);

    if (!invitee) {
      return NextResponse.json({ error: "Invitee not found" }, { status: 404 });
    }

    // Prevent self-invitation
    if (inviteeId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot invite yourself" },
        { status: 400 },
      );
    }

    // Check if invitation already exists
    const [existingInvitation] = await db
      .select({ id: invitation.id })
      .from(invitation)
      .where(
        and(
          eq(invitation.inviterId, session.user.id),
          eq(invitation.inviteeId, inviteeId),
        ),
      )
      .limit(1);

    if (existingInvitation) {
      return NextResponse.json(
        { error: "Invitation already sent" },
        { status: 409 },
      );
    }

    // Create the invitation
    const now = new Date();
    const [newInvitation] = await db
      .insert(invitation)
      .values({
        inviterId: session.user.id,
        inviteeId,
        status: "pending",
        createdAt: now,
        updatedAt: now,
      })
      .returning({
        id: invitation.id,
        inviterId: invitation.inviterId,
        inviteeId: invitation.inviteeId,
        status: invitation.status,
        createdAt: invitation.createdAt,
        updatedAt: invitation.updatedAt,
      });

    const [inviteeData] = await db
      .select({
        name: user.name,
        email: user.email,
      })
      .from(user)
      .where(eq(user.id, inviteeId))
      .limit(1);

    return NextResponse.json(
      {
        ...newInvitation,
        inviteeName: inviteeData?.name || null,
        inviteeEmail: inviteeData?.email || null,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
