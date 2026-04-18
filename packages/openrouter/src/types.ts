export type OpenRouterModel = {
  id: string;
  name?: string;
  canonical_slug?: string;
  description?: string;
  architecture?: {
    input_modalities?: string[];
    output_modalities?: string[];
  };
  pricing?: Record<string, string>;
};

export type OpenRouterModelsResponse = {
  data: OpenRouterModel[];
};

export type OpenRouterVideoModel = {
  id: string;
  name?: string;
  canonical_slug?: string;
  description?: string;
  generate_audio?: boolean;
  supported_aspect_ratios?: string[];
  supported_durations?: number[];
  supported_resolutions?: string[];
  supported_frame_images?: string[];
  allowed_passthrough_parameters?: string[];
  pricing_skus?: Record<string, string>;
};

export type OpenRouterVideoModelsResponse = {
  data: OpenRouterVideoModel[];
};

export type OpenRouterImageMessageImage = {
  type: "image_url";
  image_url: {
    url: string;
  };
};

export type OpenRouterImageGenerationResponse = {
  id: string;
  model: string;
  choices: Array<{
    finish_reason: string | null;
    message: {
      role: string;
      content: string | null;
      images?: OpenRouterImageMessageImage[];
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost?: number;
  };
};

export type OpenRouterTextGenerationResponse = {
  id: string;
  model: string;
  choices: Array<{
    finish_reason: string | null;
    message: {
      role: string;
      content: string | null;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost?: number;
  };
};

export type OpenRouterChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type OpenRouterVideoGenerationRequest = {
  model: string;
  prompt: string;
  aspect_ratio?: string;
  duration?: number;
  resolution?: string;
  generate_audio?: boolean;
  frame_images?: Array<{
    type: string;
    image_url: {
      url: string;
    };
    frame_type: string;
  }>;
  input_references?: Array<{
    type?: string;
    image_url: {
      url: string;
    };
  }>;
  [key: string]: unknown;
};

export type OpenRouterVideoGenerationSubmission = {
  id: string;
  polling_url: string;
  status: string;
  generation_id?: string;
};

export type OpenRouterVideoGenerationStatus = {
  id: string;
  polling_url: string;
  status: string;
  generation_id?: string;
  unsigned_urls?: string[];
  error?: string;
  usage?: {
    cost?: number;
    is_byok?: boolean;
  };
};
