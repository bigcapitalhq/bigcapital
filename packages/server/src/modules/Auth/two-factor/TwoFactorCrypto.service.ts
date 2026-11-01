import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createCipheriv,
  createDecipheriv,
  hkdfSync,
  randomBytes,
} from 'crypto';

const VERSION = 'v1';
const ALGORITHM = 'aes-256-gcm';
const IV_BYTES = 12;
const HKDF_INFO = 'bigcapital:two-factor:secret:v1';

/**
 * Key ids stored with each ciphertext, so a secret stays readable when the
 * deployment later moves from the derived key to a dedicated one.
 *  - `k`: derived from TWO_FACTOR_ENCRYPTION_KEY.
 *  - `j`: derived from APP_JWT_SECRET (fallback when no dedicated key is set).
 */
type KeyId = 'k' | 'j';

/**
 * Encrypts TOTP secrets at rest with AES-256-GCM. The stored value is
 * `v1:<key id>:<iv>:<auth tag>:<ciphertext>` (base64url parts).
 */
@Injectable()
export class TwoFactorCryptoService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Encrypts the given plain text with the current key.
   */
  public encrypt(plainText: string): string {
    const keyId = this.currentKeyId();
    const key = this.getKey(keyId);
    const iv = randomBytes(IV_BYTES);
    const cipher = createCipheriv(ALGORITHM, key, iv);
    const cipherText = Buffer.concat([
      cipher.update(plainText, 'utf8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    return [
      VERSION,
      keyId,
      iv.toString('base64url'),
      tag.toString('base64url'),
      cipherText.toString('base64url'),
    ].join(':');
  }

  /**
   * Decrypts a value produced by `encrypt`.
   * @throws {Error} when the value is malformed, the key is missing or the
   *  value was tampered with.
   */
  public decrypt(value: string): string {
    const [version, keyId, iv, tag, cipherText] = String(value).split(':');

    if (version !== VERSION || !iv || !tag || cipherText === undefined) {
      throw new Error('Unsupported two-factor secret format.');
    }
    const key = this.getKey(keyId as KeyId);
    const decipher = createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(iv, 'base64url'),
    );
    decipher.setAuthTag(Buffer.from(tag, 'base64url'));

    return Buffer.concat([
      decipher.update(Buffer.from(cipherText, 'base64url')),
      decipher.final(),
    ]).toString('utf8');
  }

  private currentKeyId(): KeyId {
    return this.configService.get<string>('twoFactor.encryptionKey')
      ? 'k'
      : 'j';
  }

  private getKey(keyId: KeyId): Buffer {
    const material =
      keyId === 'k'
        ? this.configService.get<string>('twoFactor.encryptionKey')
        : keyId === 'j'
          ? this.configService.get<string>('jwt.secret')
          : null;

    if (!material) {
      throw new Error(
        keyId === 'k'
          ? 'TWO_FACTOR_ENCRYPTION_KEY is not configured, the two-factor secrets cannot be read.'
          : 'Unknown two-factor encryption key.',
      );
    }
    return Buffer.from(
      hkdfSync('sha256', material, Buffer.alloc(0), HKDF_INFO, 32),
    );
  }
}
