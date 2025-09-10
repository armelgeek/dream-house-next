CREATE TYPE "public"."transaction_type" AS ENUM('buy', 'sell', 'rent');--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "transaction_type" "transaction_type" NOT NULL;