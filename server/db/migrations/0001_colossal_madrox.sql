CREATE TABLE IF NOT EXISTS "budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"name" varchar(256) NOT NULL,
	"amount" double precision NOT NULL,
	"start_date" timestamp with time zone DEFAULT now(),
	"end_date" timestamp with time zone,
	"active" smallint DEFAULT 1 NOT NULL,
	"user_id" text NOT NULL,
	"category_id" integer NOT NULL,
	"currency_id" integer NOT NULL,
	"account_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "budgets_to_transactions" (
	"budget_id" uuid NOT NULL,
	"transaction_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "budget_to_transaction_pk" PRIMARY KEY("user_id","budget_id","transaction_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bud_user_id_idx" ON "budgets" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bud_account_id_idx" ON "budgets" ("account_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "btt_budget_id_idx" ON "budgets_to_transactions" ("budget_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "btt_transaction_id_idx" ON "budgets_to_transactions" ("transaction_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "btt_user_id_idx" ON "budgets_to_transactions" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budgets" ADD CONSTRAINT "budgets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budgets" ADD CONSTRAINT "budgets_category_id_transaction_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "transaction_categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budgets" ADD CONSTRAINT "budgets_currency_id_currencies_id_fk" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budgets" ADD CONSTRAINT "budgets_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budgets_to_transactions" ADD CONSTRAINT "budgets_to_transactions_budget_id_budgets_id_fk" FOREIGN KEY ("budget_id") REFERENCES "budgets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budgets_to_transactions" ADD CONSTRAINT "budgets_to_transactions_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budgets_to_transactions" ADD CONSTRAINT "budgets_to_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
