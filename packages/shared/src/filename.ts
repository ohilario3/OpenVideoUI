const MAX_FILENAME_BASE_LENGTH = 80;

/**
 * Converts a free-form title into a filesystem-safe slug suitable for use as
 * the base of a stored asset filename. Preserves Unicode letters/digits but
 * collapses whitespace and removes characters that are unsafe across macOS,
 * Linux, and Windows. Returns null if the resulting slug is empty.
 */
export function slugifyForFilename(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[.\s-]+|[.\s-]+$/g, "")
    .replace(/\s/g, "-");

  if (!normalized) {
    return null;
  }

  if (normalized.length <= MAX_FILENAME_BASE_LENGTH) {
    return normalized;
  }

  return normalized.slice(0, MAX_FILENAME_BASE_LENGTH).replace(/[.\s-]+$/g, "");
}

/**
 * Builds a filename hint for a stored render output asset, preferring the
 * sanitized render title and falling back to a generic indexed name.
 */
export function buildRenderAssetFileName(input: {
  title?: string | null;
  index: number;
  extension: string;
  fallbackPrefix?: string;
}): string {
  const slug = slugifyForFilename(input.title);
  const indexSuffix = input.index > 0 ? `-${input.index + 1}` : "";
  const ext = input.extension.startsWith(".") ? input.extension : `.${input.extension}`;

  if (slug) {
    return `${slug}${indexSuffix}${ext}`;
  }

  const prefix = input.fallbackPrefix ?? "render";
  return `${prefix}-${input.index + 1}${ext}`;
}
