import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./auth-schema"

export const messages = pgTable("converse_message", (t) => ({
    id: t.uuid("id").defaultRandom().primaryKey().unique(),
    senderId: t.uuid("sender_id").notNull().references(() => user.id),
    recieverId: t.uuid("reciever_id").notNull().references(() => user.id),
    message: t.text("message"),
    createdAt: t.timestamp("created_at").notNull(),
    updatedAt: t.timestamp("updated_at")
        .$onUpdate(() => new Date())
        .notNull(),
}));