import * as crypto from 'crypto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * AES-256-GCM envelope encryption for Square access/refresh tokens at rest.
 * Key comes from env `SQUARE_TOKEN_ENCRYPTION_KEY` (32 bytes hex = 64 chars).
 *
 * Storage format: `b64(iv):b64(authTag):b64(ciphertext)`
 *
 * Rotation: change the env var → existing stored tokens become undecryptable
 * and users have to reconnect. Acceptable failure mode since tokens are
 * regenerable via OAuth; never try to dual-decrypt with old + new keys here.
 */
@Injectable()
export class TokenEncryption implements OnModuleInit {
  private key: Buffer | null = null;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const hex = this.config.get<string>('SQUARE_TOKEN_ENCRYPTION_KEY');
    if (!hex) {
      // Allowed: integration simply refuses to store tokens until configured.
      // OAuth attempts will fail loudly rather than silently insecure.
      return;
    }
    if (hex.length !== 64) {
      throw new Error(
        'SQUARE_TOKEN_ENCRYPTION_KEY must be 64 hex chars (32 bytes).',
      );
    }
    this.key = Buffer.from(hex, 'hex');
  }

  private requireKey(): Buffer {
    if (!this.key) {
      throw new Error(
        'Square token encryption is not configured; set SQUARE_TOKEN_ENCRYPTION_KEY.',
      );
    }
    return this.key;
  }

  public encrypt(plaintext: string): string {
    const key = this.requireKey();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return [
      iv.toString('base64'),
      tag.toString('base64'),
      enc.toString('base64'),
    ].join(':');
  }

  public decrypt(envelope: string): string {
    const key = this.requireKey();
    const [ivB64, tagB64, encB64] = envelope.split(':');
    if (!ivB64 || !tagB64 || !encB64) {
      throw new Error('Malformed encrypted token envelope.');
    }
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(ivB64, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
    const dec = Buffer.concat([
      decipher.update(Buffer.from(encB64, 'base64')),
      decipher.final(),
    ]);
    return dec.toString('utf8');
  }
}
