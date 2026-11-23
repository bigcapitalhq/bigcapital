import { registerAs } from '@nestjs/config';

export default registerAs('twoFactor', () => ({
  /**
   * Key used to encrypt the TOTP secrets at rest (any long random string,
   * e.g. `openssl rand -base64 32`). When empty, a key derived from
   * APP_JWT_SECRET is used instead.
   */
  encryptionKey: process.env.TWO_FACTOR_ENCRYPTION_KEY || '',

  /**
   * Issuer name shown in authenticator apps.
   */
  issuer: process.env.TWO_FACTOR_ISSUER || 'Bigcapital',
}));
