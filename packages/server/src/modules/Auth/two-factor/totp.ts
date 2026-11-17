import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

/**
 * Time-based one-time passwords (RFC 6238) on top of HOTP (RFC 4226), with
 * the parameters every common authenticator app supports: HMAC-SHA1,
 * 6 digits, 30 second steps.
 */
export const TOTP_DIGITS = 6;
export const TOTP_PERIOD_SECONDS = 30;
export const TOTP_ALGORITHM = 'SHA1';

/**
 * Number of steps accepted before and after the current one, to allow for
 * clock drift between the server and the phone.
 */
export const TOTP_WINDOW = 1;

/**
 * Secret length in bytes (160 bits, as recommended by RFC 4226).
 */
export const TOTP_SECRET_BYTES = 20;

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Encodes the given bytes as RFC 4648 base32 without padding.
 */
export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

/**
 * Decodes RFC 4648 base32 (case-insensitive, spaces and padding ignored).
 * @throws {Error} on characters outside the base32 alphabet.
 */
export function base32Decode(input: string): Buffer {
  const cleaned = input.replace(/[\s=]/g, '').toUpperCase();
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;

  for (const char of cleaned) {
    const index = BASE32_ALPHABET.indexOf(char);

    if (index === -1) {
      throw new Error('Invalid base32 character.');
    }
    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

/**
 * Generates a new random TOTP secret, base32 encoded.
 */
export function generateTotpSecret(): string {
  return base32Encode(randomBytes(TOTP_SECRET_BYTES));
}

/**
 * Computes the HOTP value of the given key and counter (RFC 4226).
 */
export function hotp(
  key: Buffer,
  counter: number,
  digits: number = TOTP_DIGITS,
): string {
  const message = Buffer.alloc(8);
  message.writeBigUInt64BE(BigInt(counter));

  const hmac = createHmac('sha1', key).update(message).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    (hmac[offset + 1] << 16) |
    (hmac[offset + 2] << 8) |
    hmac[offset + 3];

  return String(binary % 10 ** digits).padStart(digits, '0');
}

/**
 * Returns the TOTP time step for the given time.
 * @param {number} nowMs - Unix time in milliseconds.
 */
export function totpStep(nowMs: number = Date.now()): number {
  return Math.floor(nowMs / 1000 / TOTP_PERIOD_SECONDS);
}

/**
 * Computes the TOTP code of the given base32 secret for the given time.
 */
export function generateTotpCode(
  secret: string,
  nowMs: number = Date.now(),
): string {
  return hotp(base32Decode(secret), totpStep(nowMs));
}

/**
 * Normalizes a code typed by a user: digits only ("123 456" -> "123456").
 */
export function normalizeTotpCode(code: string): string {
  return String(code ?? '').replace(/[\s-]/g, '');
}

/**
 * Verifies the given code against the secret, accepting the current step and
 * TOTP_WINDOW steps around it. Every candidate step is compared in constant
 * time, so the response time does not reveal which step matched.
 * @returns {number | null} The matched time step, or null when the code is wrong.
 */
export function verifyTotpCode(
  secret: string,
  code: string,
  nowMs: number = Date.now(),
  window: number = TOTP_WINDOW,
): number | null {
  const normalized = normalizeTotpCode(code);

  if (!new RegExp(`^\\d{${TOTP_DIGITS}}$`).test(normalized)) {
    return null;
  }
  const key = base32Decode(secret);
  const current = totpStep(nowMs);
  const given = Buffer.from(normalized);
  let matched: number | null = null;

  for (let offset = -window; offset <= window; offset++) {
    const step = current + offset;
    const expected = Buffer.from(hotp(key, step));

    if (timingSafeEqual(expected, given) && matched === null) {
      matched = step;
    }
  }
  return matched;
}

/**
 * Builds the otpauth:// URI that authenticator apps read from the QR code.
 * @see https://github.com/google/google-authenticator/wiki/Key-Uri-Format
 */
export function buildOtpauthUri(
  secret: string,
  accountName: string,
  issuer: string,
): string {
  const label = `${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}`;
  // Spaces are encoded as %20, not "+": some apps show a "+" literally.
  const params = [
    ['secret', secret],
    ['issuer', issuer],
    ['algorithm', TOTP_ALGORITHM],
    ['digits', String(TOTP_DIGITS)],
    ['period', String(TOTP_PERIOD_SECONDS)],
  ]
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return `otpauth://totp/${label}?${params}`;
}
