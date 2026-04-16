import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/schema/auth-schema";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  const searchQuery = query
    .split(" ")
    .map((w) => `${w}:*`)
    .join(" & ");

  const results = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    })
    .from(user)
    .where(sql`${user.search} @@ to_tsquery('english', ${searchQuery}) and email != ${session.user.email}`)
    .limit(10);

  return NextResponse.json(results);
}
