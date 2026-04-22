import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { messages, user } from "@/lib/schema";
import { asc, and, eq, gt, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

const sender = alias(user, "sender");
const receiver = alias(user, "receiver");

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get("contactId");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const cursor = searchParams.get("cursor");

  if (!contactId) {
    return new NextResponse("Contact ID is required", { status: 400 });
  }

  const conversationFilter = or(
    and(
      eq(messages.senderId, session.user.id),
      eq(messages.recieverId, contactId),
    ),
    and(
      eq(messages.senderId, contactId),
      eq(messages.recieverId, session.user.id),
    ),
  );

  const cursorFilter = cursor
    ? gt(messages.createdAt, new Date(cursor))
    : undefined;

  const data = await db
    .select({
      message: messages.message,
      sender: {
        name: sender.name,
        email: sender.email,
        image: sender.image,
        id: sender.id
      },
      receiver: {
        name: receiver.name,
        email: receiver.email,
        image: receiver.image,
        id: receiver.id
      },
      createdAt: messages.createdAt,
    })
    .from(messages)
    .leftJoin(sender, eq(messages.senderId, sender.id))
    .leftJoin(receiver, eq(messages.recieverId, receiver.id))
    .where(cursor ? and(conversationFilter, cursorFilter) : conversationFilter)
    .orderBy(asc(messages.createdAt))
    .limit(limit + 1);

  const hasMore = data.length > limit;
  const nextCursor = hasMore ? data.pop()?.createdAt : null;

  return NextResponse.json(
    { messages: data, nextCursor, hasMore },
    { status: 200 },
  );
}
