import {
  RECOVERY_CODES_COUNT,
  generateRecoveryCodes,
  hashRecoveryCode,
  isRecoveryCodeFormat,
  normalizeRecoveryCode,
} from './recovery-codes';

describe('recovery codes', () => {
  it('generates 10 distinct codes in groups of four', () => {
    const codes = generateRecoveryCodes();

    expect(codes).toHaveLength(RECOVERY_CODES_COUNT);
    expect(new Set(codes).size).toBe(RECOVERY_CODES_COUNT);
    codes.forEach((code) => {
      expect(code).toMatch(
        /^[0-9a-hjkmnp-tv-z]{4}(-[0-9a-hjkmnp-tv-z]{4}){3}$/,
      );
      expect(isRecoveryCodeFormat(code)).toBe(true);
    });
  });

  it('ignores case, spaces and dashes, and maps look-alike letters', () => {
    expect(normalizeRecoveryCode(' AB1C-d0EF-ghjk-mnpq ')).toBe(
      'ab1cd0efghjkmnpq',
    );
    expect(normalizeRecoveryCode('abIc-dOef-ghjk-mnpL')).toBe(
      'ab1cd0efghjkmnp1',
    );
    expect(hashRecoveryCode('ABIC-DOEF-GHJK-MNPQ')).toBe(
      hashRecoveryCode('ab1c d0ef ghjk mnpq'),
    );
  });

  it('stores a SHA-256 hash, not the code', () => {
    const [code] = generateRecoveryCodes(1);
    const hash = hashRecoveryCode(code);

    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).not.toContain(normalizeRecoveryCode(code));
  });

  it('recognises what is not a recovery code', () => {
    expect(isRecoveryCodeFormat('123456')).toBe(false);
    expect(isRecoveryCodeFormat('abcd-efgh-jkmn-pqr')).toBe(false);
    expect(isRecoveryCodeFormat('abcd-efgh-jkmn-pqru')).toBe(false);
    expect(isRecoveryCodeFormat('')).toBe(false);
  });
});
