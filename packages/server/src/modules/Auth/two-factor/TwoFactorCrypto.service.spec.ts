import { TwoFactorCryptoService } from './TwoFactorCrypto.service';

const configWith = (values: Record<string, string | undefined>) =>
  ({ get: (key: string) => values[key] }) as any;

describe('TwoFactorCryptoService', () => {
  const jwtOnly = configWith({ 'jwt.secret': 'jwt-secret-for-tests' });
  const withKey = configWith({
    'jwt.secret': 'jwt-secret-for-tests',
    'twoFactor.encryptionKey': 'dedicated-two-factor-key-for-tests',
  });

  it('round-trips with a key derived from APP_JWT_SECRET', () => {
    const service = new TwoFactorCryptoService(jwtOnly);
    const encrypted = service.encrypt('JBSWY3DPEHPK3PXP');

    expect(encrypted).toMatch(/^v1:j:/);
    expect(encrypted).not.toContain('JBSWY3DPEHPK3PXP');
    expect(service.decrypt(encrypted)).toBe('JBSWY3DPEHPK3PXP');
  });

  it('uses TWO_FACTOR_ENCRYPTION_KEY when set', () => {
    const service = new TwoFactorCryptoService(withKey);
    const encrypted = service.encrypt('secret');

    expect(encrypted).toMatch(/^v1:k:/);
    expect(service.decrypt(encrypted)).toBe('secret');
  });

  it('still reads values encrypted before a dedicated key was set', () => {
    const before = new TwoFactorCryptoService(jwtOnly).encrypt('secret');
    expect(new TwoFactorCryptoService(withKey).decrypt(before)).toBe('secret');
  });

  it('uses a fresh IV for every value', () => {
    const service = new TwoFactorCryptoService(withKey);
    expect(service.encrypt('same')).not.toBe(service.encrypt('same'));
  });

  it('detects tampering', () => {
    const service = new TwoFactorCryptoService(withKey);
    const parts = service.encrypt('secret').split(':');
    const cipherText = Buffer.from(parts[4], 'base64url');
    cipherText[0] ^= 1;
    parts[4] = cipherText.toString('base64url');

    expect(() => service.decrypt(parts.join(':'))).toThrow();
  });

  it('fails clearly when the dedicated key is gone', () => {
    const encrypted = new TwoFactorCryptoService(withKey).encrypt('secret');
    expect(() =>
      new TwoFactorCryptoService(jwtOnly).decrypt(encrypted),
    ).toThrow(/TWO_FACTOR_ENCRYPTION_KEY/);
  });

  it('refuses unknown formats', () => {
    const service = new TwoFactorCryptoService(withKey);
    expect(() => service.decrypt('plain-secret')).toThrow();
    expect(() => service.decrypt('v2:k:a:b:c')).toThrow();
  });
});
