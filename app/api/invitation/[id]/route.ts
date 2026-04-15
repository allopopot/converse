import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { invitation } from "@/lib/schema";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (!status || !["accepted", "rejected"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status. Must be 'accepted' or 'rejected'" },
      { status: 400 },
    );
  }

  try {
    // Check if the invitation exists and the user is the invitee
    const [existingInvitation] = await db
      .select({ id: invitation.id, inviteeId: invitation.inviteeId })
      .from(invitation)
      .where(eq(invitation.id, id))
      .limit(1);

    if (!existingInvitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 },
      );
    }

    if (existingInvitation.inviteeId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only respond to invitations sent to you" },
        { status: 403 },
      );
    }

    // Update the invitation status
    const [updatedInvitation] = await db
      .update(invitation)
      .set({ status, updatedAt: new Date() })
      .where(eq(invitation.id, id))
      .returning({
        id: invitation.id,
        status: invitation.status,
        updatedAt: invitation.updatedAt,
      });

    return NextResponse.json(updatedInvitation);
  } catch (error) {
    console.error("Error updating invitation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
