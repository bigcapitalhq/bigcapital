/**
 * Normalises free-text input from the colour field towards a `#rrggbb` hex
 * string: forces a single leading `#`, drops non-hex characters and caps the
 * length at 6 digits. Returns `''` for empty input so the field can stay
 * blank. Downstream (`<HexColorPicker>`) still guards against partial values
 * like `#a`.
 */
export function sanitizeToHexColor(input: string): string {
  if (!input) {
    return '';
  }
  const digits = input
    .replace(/[^0-9a-fA-F]/g, '')
    .slice(0, 6)
    .toLowerCase();

  return digits ? `#${digits}` : '#';
}
