import {
  base32Decode,
  base32Encode,
  buildOtpauthUri,
  generateTotpCode,
  generateTotpSecret,
  hotp,
  verifyTotpCode,
} from './totp';

// RFC 6238 appendix B, SHA1 key "12345678901234567890". The RFC lists 8
// digits; a 6-digit code is the same value modulo 10^6 (the last 6 digits).
const RFC_SECRET = base32Encode(Buffer.from('12345678901234567890', 'ascii'));
const RFC_VECTORS: Array<[number, string]> = [
  [59, '287082'],
  [1111111109, '081804'],
  [1111111111, '050471'],
  [1234567890, '005924'],
  [2000000000, '279037'],
  [20000000000, '353130'],
];

describe('TOTP (RFC 6238)', () => {
  it.each(RFC_VECTORS)('matches the RFC test vector at T=%d', (time, code) => {
    expect(generateTotpCode(RFC_SECRET, time * 1000)).toBe(code);
  });

  it('matches the RFC 4226 HOTP test vectors', () => {
    const key = Buffer.from('12345678901234567890', 'ascii');
    const expected = ['755224', '287082', '359152', '969429', '338314'];

    expected.forEach((code, counter) => {
      expect(hotp(key, counter)).toBe(code);
    });
  });

  it('round-trips base32', () => {
    const bytes = Buffer.from([0, 1, 2, 250, 251, 252, 253, 254, 255, 7]);
    expect(base32Decode(base32Encode(bytes))).toEqual(bytes);
    expect(base32Encode(Buffer.from('foobar'))).toBe('MZXW6YTBOI');
    expect(base32Decode('mzxw 6ytb oi==').toString()).toBe('foobar');
  });

  it('rejects characters outside the base32 alphabet', () => {
    expect(() => base32Decode('ABC1')).toThrow();
  });

  it('generates 160-bit secrets that differ', () => {
    const a = generateTotpSecret();
    const b = generateTotpSecret();

    expect(a).toMatch(/^[A-Z2-7]{32}$/);
    expect(base32Decode(a)).toHaveLength(20);
    expect(a).not.toBe(b);
  });

  describe('verifyTotpCode', () => {
    const secret = generateTotpSecret();
    const now = 1_700_000_000_000;
    const step = Math.floor(now / 30000);

    it('accepts the current step and returns it', () => {
      expect(verifyTotpCode(secret, generateTotpCode(secret, now), now)).toBe(
        step,
      );
    });

    it('accepts one step of clock drift either way', () => {
      expect(
        verifyTotpCode(secret, generateTotpCode(secret, now - 30000), now),
      ).toBe(step - 1);
      expect(
        verifyTotpCode(secret, generateTotpCode(secret, now + 30000), now),
      ).toBe(step + 1);
    });

    it('rejects codes two steps away', () => {
      const old = generateTotpCode(secret, now - 60000);
      const future = generateTotpCode(secret, now + 60000);
      const near = [-1, 0, 1].map((o) =>
        generateTotpCode(secret, now + o * 30000),
      );
      // Skip the (rare) case where a far code collides with a near one.
      if (!near.includes(old)) {
        expect(verifyTotpCode(secret, old, now)).toBeNull();
      }
      if (!near.includes(future)) {
        expect(verifyTotpCode(secret, future, now)).toBeNull();
      }
    });

    it('ignores spaces in the typed code', () => {
      const code = generateTotpCode(secret, now);
      expect(
        verifyTotpCode(secret, `${code.slice(0, 3)} ${code.slice(3)}`, now),
      ).toBe(step);
    });

    it('rejects malformed input', () => {
      expect(verifyTotpCode(secret, '', now)).toBeNull();
      expect(verifyTotpCode(secret, '12345', now)).toBeNull();
      expect(verifyTotpCode(secret, '1234567', now)).toBeNull();
      expect(verifyTotpCode(secret, 'abcdef', now)).toBeNull();
      expect(verifyTotpCode(secret, undefined as any, now)).toBeNull();
    });
  });

  it('builds an otpauth URI that authenticator apps read', () => {
    const uri = buildOtpauthUri(
      'JBSWY3DPEHPK3PXP',
      'a.b+c@example.com',
      'My Books',
    );

    expect(uri).toBe(
      'otpauth://totp/My%20Books:a.b%2Bc%40example.com?secret=JBSWY3DPEHPK3PXP&issuer=My%20Books&algorithm=SHA1&digits=6&period=30',
    );
  });
});
