export const renderStatuses = [
  "queued",
  "processing",
  "completed",
  "failed"
] as const;

export const modelWorkflows = [
  "text-to-video",
  "image-to-video",
  "text-to-image"
] as const;

export const studioBootstrapProjects = [
  {
    name: "Product Teaser",
    workflow: "text-to-video",
    renders: 4,
    note: "Video-first launch concept with a single hero output and follow-up motion variants."
  },
  {
    name: "Brand Frames",
    workflow: "text-to-image",
    renders: 7,
    note: "Reference stills and style studies used to guide future motion work."
  },
  {
    name: "Launch Sequence",
    workflow: "image-to-video",
    renders: 2,
    note: "Reference-frame-driven sequence exploring product geometry and pacing."
  }
] as const;

export const studioInfrastructure = [
  {
    name: "Web",
    role: "Next.js app",
    note: "Owns the signed-in shell, route handlers, and the first studio surface."
  },
  {
    name: "Worker",
    role: "Async runner",
    note: "Will own OpenRouter submission, polling, retries, and recovery."
  },
  {
    name: "Postgres",
    role: "Durable state",
    note: "Holds users, projects, renders, assets, and lifecycle events."
  },
  {
    name: "Redis",
    role: "Queue backplane",
    note: "Coordinates job dispatch, locks, and short-lived runtime state."
  }
] as const;

