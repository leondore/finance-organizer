DO $$ BEGIN
 CREATE TYPE "account_category" AS ENUM('cash', 'bank', 'creditCard', 'debitCard', 'investment', 'loan', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "transaction_status" AS ENUM('pending', 'completed', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "transaction_type" AS ENUM('credit', 'debit');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" "account_category" NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"name" varchar(256) NOT NULL,
	"balance" double precision DEFAULT 0 NOT NULL,
	"description" text,
	"category_id" integer NOT NULL,
	"account_number" varchar(64),
	"institution_id" integer,
	"user_id" text NOT NULL,
	"currency_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts_to_tags" (
	"account_id" uuid NOT NULL,
	"tag_id" integer NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "accounts_to_tags_pk" PRIMARY KEY("user_id","account_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "institutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"name" varchar(256) NOT NULL,
	"code" varchar(64),
	"logo_id" uuid,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"user_id" text NOT NULL,
	"first_name" varchar(64) NOT NULL,
	"last_name" varchar(64),
	"phone" varchar(16),
	"avatar_id" uuid,
	"country_id" integer,
	CONSTRAINT "profile_pk" PRIMARY KEY("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" varchar(32) NOT NULL,
	CONSTRAINT "roles_role_unique" UNIQUE("role")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_settings" (
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"user_id" text NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text,
	CONSTRAINT "user_settings_pk" PRIMARY KEY("user_id","key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"email" varchar(256) NOT NULL,
	"password" text NOT NULL,
	"role_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"name" varchar(256) NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"code" varchar(8) NOT NULL,
	CONSTRAINT "countries_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "currencies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"code" varchar(8) NOT NULL,
	"symbol" char(8),
	CONSTRAINT "currencies_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"name" varchar(256) NOT NULL,
	"color" varchar(32),
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"name" varchar(256) NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "providers_to_categories" (
	"provider_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "provider_to_category_pk" PRIMARY KEY("user_id","provider_id","category_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"name" varchar(256) NOT NULL,
	"type" "transaction_type" NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"user_id" text NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_sets_to_transactions" (
	"transaction_set_id" uuid NOT NULL,
	"transaction_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "transaction_set_to_transaction_pk" PRIMARY KEY("user_id","transaction_set_id","transaction_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"description" text,
	"amount" double precision NOT NULL,
	"transaction_date" timestamp with time zone DEFAULT now(),
	"type" "transaction_type" NOT NULL,
	"status" "transaction_status" DEFAULT 'completed' NOT NULL,
	"is_template" boolean DEFAULT false NOT NULL,
	"is_recurring" boolean DEFAULT false NOT NULL,
	"recurring_cron" varchar(256),
	"recurring_until" timestamp with time zone,
	"account_id" uuid,
	"user_id" text NOT NULL,
	"currency_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"provider_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions_to_attachments" (
	"transaction_id" uuid NOT NULL,
	"attachment_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "transaction_to_attachment_pk" PRIMARY KEY("user_id","transaction_id","attachment_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions_to_tags" (
	"transaction_id" uuid NOT NULL,
	"tag_id" integer NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "transaction_to_tag_pk" PRIMARY KEY("user_id","transaction_id","tag_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "acc_user_id_idx" ON "accounts" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "acc_category_id_idx" ON "accounts" ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "att_account_id_idx" ON "accounts_to_tags" ("account_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "att_tag_id_idx" ON "accounts_to_tags" ("tag_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "att_user_id_idx" ON "accounts_to_tags" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ins_user_id_idx" ON "institutions" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prf_fname_lname_idx" ON "profiles" ("first_name","last_name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "rol_role_idx" ON "roles" ("role");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "usr_email_idx" ON "users" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "atc_user_id_idx" ON "attachments" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "cnt_code_idx" ON "countries" ("code");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "cur_code_idx" ON "currencies" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tag_user_id_idx" ON "tags" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prv_user_id_idx" ON "providers" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ptc_provider_id_idx" ON "providers_to_categories" ("provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ptc_category_id_idx" ON "providers_to_categories" ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ptc_user_id_idx" ON "providers_to_categories" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trc_user_id_idx" ON "transaction_categories" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tse_user_id_idx" ON "transaction_sets" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tst_transaction_set_id_idx" ON "transaction_sets_to_transactions" ("transaction_set_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tst_transaction_id_idx" ON "transaction_sets_to_transactions" ("transaction_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tst_user_id_idx" ON "transaction_sets_to_transactions" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trs_account_id_idx" ON "transactions" ("account_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trs_date_idx" ON "transactions" ("transaction_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trs_user_id_idx" ON "transactions" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trs_category_id_idx" ON "transactions" ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trs_provider_id_idx" ON "transactions" ("provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trs_currency_id_idx" ON "transactions" ("currency_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tta_transaction_id_idx" ON "transactions_to_attachments" ("transaction_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tta_attachment_id_idx" ON "transactions_to_attachments" ("attachment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tta_user_id_idx" ON "transactions_to_attachments" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ttt_transaction_id_idx" ON "transactions_to_tags" ("transaction_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ttt_tag_id_idx" ON "transactions_to_tags" ("tag_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ttt_user_id_idx" ON "transactions_to_tags" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_category_id_account_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "account_categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_currency_id_currencies_id_fk" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts_to_tags" ADD CONSTRAINT "accounts_to_tags_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts_to_tags" ADD CONSTRAINT "accounts_to_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts_to_tags" ADD CONSTRAINT "accounts_to_tags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "institutions" ADD CONSTRAINT "institutions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attachments" ADD CONSTRAINT "attachments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "providers" ADD CONSTRAINT "providers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "providers_to_categories" ADD CONSTRAINT "providers_to_categories_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "providers_to_categories" ADD CONSTRAINT "providers_to_categories_category_id_transaction_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "transaction_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "providers_to_categories" ADD CONSTRAINT "providers_to_categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_categories" ADD CONSTRAINT "transaction_categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_sets" ADD CONSTRAINT "transaction_sets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_sets_to_transactions" ADD CONSTRAINT "transaction_sets_to_transactions_transaction_set_id_transaction_sets_id_fk" FOREIGN KEY ("transaction_set_id") REFERENCES "transaction_sets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_sets_to_transactions" ADD CONSTRAINT "transaction_sets_to_transactions_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_sets_to_transactions" ADD CONSTRAINT "transaction_sets_to_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_currency_id_currencies_id_fk" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_transaction_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "transaction_categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions_to_attachments" ADD CONSTRAINT "transactions_to_attachments_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions_to_attachments" ADD CONSTRAINT "transactions_to_attachments_attachment_id_attachments_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "attachments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions_to_attachments" ADD CONSTRAINT "transactions_to_attachments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions_to_tags" ADD CONSTRAINT "transactions_to_tags_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions_to_tags" ADD CONSTRAINT "transactions_to_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions_to_tags" ADD CONSTRAINT "transactions_to_tags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
