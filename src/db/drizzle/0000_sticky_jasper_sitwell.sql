DO $$ BEGIN
 CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'banned');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."message_type" AS ENUM('tagged', 'reply', 'message');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256),
	"username" varchar(256),
	"is_verified" boolean DEFAULT false,
	"profile_url" varchar(512) DEFAULT null,
	"user_status" "user_status" DEFAULT 'inactive',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp NOT NULL,
	"socket_connected" jsonb DEFAULT '[]' NOT NULL,
	"password" varchar NOT NULL,
	"password_reset_token" varchar(255) DEFAULT null,
	"password_reset_expires" timestamp DEFAULT null,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_factors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid,
	"value" varchar(512) DEFAULT null,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp DEFAULT now(),
	"is_valid" boolean DEFAULT true,
	"is_used" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_name" varchar(255) NOT NULL,
	"participants" jsonb DEFAULT '[]' NOT NULL,
	"participantsId" jsonb DEFAULT '[]' NOT NULL,
	"profileUrl" varchar DEFAULT null
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid,
	"text" varchar(255),
	"file" varchar(255),
	"conversations_id" uuid,
	"targetted_user" jsonb DEFAULT '[]' NOT NULL,
	"send_at" timestamp DEFAULT now(),
	"read_by" jsonb DEFAULT '[]' NOT NULL,
	"type" "message_type" DEFAULT 'message',
	"profile_pic" varchar(255)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verification_factors" ADD CONSTRAINT "verification_factors_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_conversations_id_conversations_id_fk" FOREIGN KEY ("conversations_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "conversation_idx" ON "message" USING btree ("conversations_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "conversation_send_at_idx" ON "message" USING btree ("conversations_id","send_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "send_at_idx" ON "message" USING btree ("send_at");