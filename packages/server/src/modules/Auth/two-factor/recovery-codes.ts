import { createHash, randomBytes } from 'crypto';

/**
 * Number of recovery codes generated at a time.
 */
export const RECOVERY_CODES_COUNT = 10;

/**
 * Characters per code: 16 symbols of 5 bits = 80 bits of entropy, enough for
 * a fast hash (like the API keys, which are stored as SHA-256 too).
 */
const RECOVERY_CODE_LENGTH = 16;
const RECOVERY_CODE_GROUP = 4;

/**
 * Crockford's base32 alphabet (no i, l, o, u), lowercase.
 */
const ALPHABET = '0123456789abcdefghjkmnpqrstvwxyz';

/**
 * Generates one recovery code, formatted as "xxxx-xxxx-xxxx-xxxx".
 */
export function generateRecoveryCode(): string {
  const bytes = randomBytes(RECOVERY_CODE_LENGTH);
  let code = '';

  for (let i = 0; i < RECOVERY_CODE_LENGTH; i++) {
    // 256 is a multiple of 32, so the modulo keeps the distribution uniform.
    code += ALPHABET[bytes[i] % ALPHABET.length];

    if ((i + 1) % RECOVERY_CODE_GROUP === 0 && i + 1 < RECOVERY_CODE_LENGTH) {
      code += '-';
    }
  }
  return code;
}

/**
 * Generates a full set of recovery codes.
 */
export function generateRecoveryCodes(
  count: number = RECOVERY_CODES_COUNT,
): string[] {
  return Array.from({ length: count }, () => generateRecoveryCode());
}

/**
 * Normalizes a recovery code as typed by a user: case, spaces and dashes are
 * ignored, and the letters Crockford's base32 maps to digits are mapped.
 */
export function normalizeRecoveryCode(code: string): string {
  return String(code ?? '')
    .toLowerCase()
    .replace(/[\s-]/g, '')
    .replace(/[il]/g, '1')
    .replace(/o/g, '0');
}

/**
 * Hashes a recovery code for storage.
 */
export function hashRecoveryCode(code: string): string {
  return createHash('sha256').update(normalizeRecoveryCode(code)).digest('hex');
}

/**
 * Whether the given input looks like a recovery code at all.
 */
export function isRecoveryCodeFormat(code: string): boolean {
  const normalized = normalizeRecoveryCode(code);

  return (
    normalized.length === RECOVERY_CODE_LENGTH &&
    [...normalized].every((char) => ALPHABET.includes(char))
  );
}
