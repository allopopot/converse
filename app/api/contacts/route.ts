import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { contact, user } from "@/lib/schema";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const contactId = searchParams.get("contactId")?.trim();
  const query = searchParams.get("q")?.trim();

  if (page < 1 || limit < 1 || limit > 100) {
    return NextResponse.json(
      { error: "Invalid pagination parameters" },
      { status: 400 },
    );
  }

  const offset = (page - 1) * limit;

  try {
    // Build where clause for contacts
    let contactWhereClause = and(
      eq(contact.userId, session.user.id),
      eq(contact.status, "accepted"),
    );

    if (contactId) {
      contactWhereClause = and(
        contactWhereClause,
        eq(contact.contactUserId, contactId),
      );
    }

    // For search, we need to build a different where clause that includes the user join
    let searchWhereClause = contactWhereClause;
    let needsUserJoin = false;

    if (query) {
      needsUserJoin = true;
      const searchQuery = query
        .split(" ")
        .map((w) => `${w}:*`)
        .join(" & ");

      searchWhereClause = and(
        searchWhereClause,
        sql`${user.search} @@ to_tsquery('english', ${searchQuery})`,
      );
    }

    // Get total count for pagination
    const totalQuery = needsUserJoin
      ? db
          .select({ count: sql<number>`count(*)` })
          .from(contact)
          .innerJoin(user, sql`${user}.id = ${contact.contactUserId}`)
          .where(searchWhereClause)
      : db
          .select({ count: sql<number>`count(*)` })
          .from(contact)
          .where(contactWhereClause);

    const [totalResult] = await totalQuery;
    const total = totalResult?.count || 0;

    // Get paginated results - join with the correct user
    const contactsQuery = db
      .select({
        id: contact.contactUserId,
        name: user.name,
        email: user.email,
        image: user.image,
        contactCreatedAt: contact.createdAt,
      })
      .from(contact)
      .innerJoin(user, eq(user.id, contact.contactUserId))
      .where(needsUserJoin ? searchWhereClause : contactWhereClause)
      .orderBy(contact.createdAt)
      .offset(offset)
      .limit(limit);

    const contacts = await contactsQuery;

    // Filter out the current user from results (in case they appear)
    const filteredContacts = contacts.filter(
      (contact) => contact.id !== session.user.id,
    );

    return NextResponse.json({
      contacts: filteredContacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
