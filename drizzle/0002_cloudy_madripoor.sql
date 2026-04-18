CREATE TABLE "model_capabilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" varchar(255) NOT NULL,
	"provider_type" varchar(32) NOT NULL,
	"name" varchar(255),
	"canonical_slug" varchar(255),
	"description" text,
	"input_modalities" jsonb NOT NULL,
	"output_modalities" jsonb NOT NULL,
	"supported_aspect_ratios" jsonb NOT NULL,
	"supported_durations" jsonb NOT NULL,
	"supported_resolutions" jsonb NOT NULL,
	"supported_frame_images" jsonb NOT NULL,
	"allowed_passthrough_parameters" jsonb NOT NULL,
	"generate_audio" boolean,
	"raw_payload" jsonb NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "model_capabilities_model_id_unique" UNIQUE("model_id")
);
