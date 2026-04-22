CREATE TABLE "converse_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid NOT NULL,
	"reciever_id" uuid NOT NULL,
	"message" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "converse_message_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "converse_message" ADD CONSTRAINT "converse_message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "converse_message" ADD CONSTRAINT "converse_message_reciever_id_user_id_fk" FOREIGN KEY ("reciever_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;