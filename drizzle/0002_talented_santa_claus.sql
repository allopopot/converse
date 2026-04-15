ALTER TABLE "invitation" ADD COLUMN "invitee_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_invitee_id_user_id_fk" FOREIGN KEY ("invitee_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invitation_inviteeId_idx" ON "invitation" USING btree ("invitee_id");