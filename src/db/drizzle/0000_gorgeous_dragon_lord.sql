DO $$ BEGIN
 CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'banned');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fruits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"color" varchar(100) NOT NULL,
	"quantity" integer NOT NULL
);
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
DO $$ BEGIN
 ALTER TABLE "verification_factors" ADD CONSTRAINT "verification_factors_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "username_idx" ON "users" USING btree ("username");