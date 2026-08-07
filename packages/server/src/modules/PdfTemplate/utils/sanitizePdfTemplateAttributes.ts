import * as sanitizeHtml from 'sanitize-html';

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'br',
    'b',
    'i',
    'u',
    'strong',
    'em',
    'p',
    'span',
    'a',
    'ul',
    'ol',
    'li',
  ],
  allowedAttributes: {
    a: ['href'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  disallowedTagsMode: 'discard',
};

export function sanitizePdfTemplateAttributes(
  attributes: Record<string, unknown>,
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attributes)) {
    sanitized[key] =
      typeof value === 'string' ? sanitizeHtml(value, SANITIZE_OPTIONS) : value;
  }
  return sanitized;
}
