CREATE TABLE "render_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"render_id" uuid NOT NULL,
	"event_type" varchar(64) NOT NULL,
	"from_status" "render_status",
	"to_status" "render_status",
	"provider_status" varchar(64),
	"message" text,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "render_input_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"render_id" uuid NOT NULL,
	"role" varchar(64) NOT NULL,
	"asset_type" varchar(32) NOT NULL,
	"source_type" varchar(32) NOT NULL,
	"file_name" varchar(255),
	"mime_type" varchar(128),
	"source_url" text,
	"storage_key" text,
	"metadata" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "render_output_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"render_id" uuid NOT NULL,
	"kind" varchar(32) NOT NULL,
	"asset_type" varchar(32) NOT NULL,
	"url" text NOT NULL,
	"storage_key" text,
	"mime_type" varchar(128),
	"position" varchar(32),
	"metadata" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "render_events" ADD CONSTRAINT "render_events_render_id_renders_id_fk" FOREIGN KEY ("render_id") REFERENCES "public"."renders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "render_input_assets" ADD CONSTRAINT "render_input_assets_render_id_renders_id_fk" FOREIGN KEY ("render_id") REFERENCES "public"."renders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "render_output_assets" ADD CONSTRAINT "render_output_assets_render_id_renders_id_fk" FOREIGN KEY ("render_id") REFERENCES "public"."renders"("id") ON DELETE cascade ON UPDATE no action;