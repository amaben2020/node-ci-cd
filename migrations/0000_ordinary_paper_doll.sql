CREATE TABLE IF NOT EXISTS "mechanicAvailability" (
	"id" serial PRIMARY KEY NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobRequests" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"status" varchar(256) DEFAULT 'NOTIFYING',
	"job_id" bigint NOT NULL,
	"mechanic_id" integer,
	"distance" text,
	"duration" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"description" text NOT NULL,
	"dispatcher" varchar(256),
	"rate" integer,
	"status" varchar(256) DEFAULT 'NOTIFYING',
	"longitude" double precision,
	"latitude" double precision,
	"location_details" text,
	"is_pending_review" boolean DEFAULT true,
	"mechanic_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mechanics" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"user_id" integer,
	"arrival_rate" integer,
	"jobCount" integer,
	"status" varchar(256),
	"last_known_location_timestamp" timestamp,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_role" varchar(256),
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobRequests" ADD CONSTRAINT "jobRequests_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobRequests" ADD CONSTRAINT "jobRequests_mechanic_id_mechanics_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."mechanics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs" ADD CONSTRAINT "jobs_mechanic_id_mechanics_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."mechanics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mechanics" ADD CONSTRAINT "mechanics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
