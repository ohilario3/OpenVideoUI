ALTER TABLE "renders" ADD COLUMN "provider_generation_id" varchar(255);--> statement-breakpoint
ALTER TABLE "renders" ADD COLUMN "provider_status" varchar(64);--> statement-breakpoint
ALTER TABLE "renders" ADD COLUMN "output_urls" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "renders" ADD COLUMN "provider_usage" jsonb;--> statement-breakpoint
ALTER TABLE "renders" ADD COLUMN "provider_request" jsonb;--> statement-breakpoint
ALTER TABLE "renders" ADD COLUMN "provider_response" jsonb;