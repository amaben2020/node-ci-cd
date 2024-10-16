CREATE TYPE "public"."userRole" AS ENUM('admin', 'client', 'mechanic');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" "userRole" DEFAULT 'mechanic',
	"created_at" timestamp with time zone DEFAULT now(),
	"created_by" text,
	"updated_at" timestamp with time zone,
	"updated_by" text,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"first_name" text,
	"last_name" text,
	"email" text,
	"phone" text,
	"last_login" timestamp with time zone,
	"password" text,
	"token" text,
	"address_one" text,
	"address_two" text,
	"city" text DEFAULT 'Abuja',
	"state" text,
	"zip" text,
	"country" text DEFAULT 'NG',
	"cognito_sub" text,
	"username" text,
	CONSTRAINT "users_first_name_unique" UNIQUE("first_name"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "users_token_unique" UNIQUE("token"),
	CONSTRAINT "users_cognito_sub_unique" UNIQUE("cognito_sub"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
