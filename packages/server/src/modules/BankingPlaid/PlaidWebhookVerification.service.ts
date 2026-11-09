import { createHash, timingSafeEqual } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import {
  decodeProtectedHeader,
  importJWK,
  jwtVerify,
  type JWK,
  type KeyLike,
} from 'jose';
import * as LRUCache from 'lru-cache';
import type { PlaidApi } from 'plaid';
import { PLAID_CLIENT } from '../Plaid/Plaid.module';

const ALLOWED_ALG = 'ES256';
const MAX_TOKEN_AGE = '5m';
const KEY_CACHE_MAX = 100;
const KEY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type ImportedKey = KeyLike | Uint8Array;

@Injectable()
export class PlaidWebhookVerificationService {
  private readonly keyCache: LRUCache<string, ImportedKey> = new LRUCache({
    max: KEY_CACHE_MAX,
    maxAge: KEY_CACHE_TTL_MS,
  });

  constructor(@Inject(PLAID_CLIENT) private readonly plaidClient: PlaidApi) {}

  public async verifyWebhook(
    rawBody: Buffer | undefined,
    verificationHeader: string | undefined,
  ): Promise<void> {
    if (!rawBody || rawBody.length === 0) {
      throw new Error('Plaid webhook raw body missing');
    }
    if (!verificationHeader) {
      throw new Error('Plaid-Verification header missing');
    }

    const header = decodeProtectedHeader(verificationHeader);
    if (header.alg !== ALLOWED_ALG) {
      throw new Error(`Unexpected webhook JWT alg: ${header.alg}`);
    }
    if (!header.kid) {
      throw new Error('Webhook JWT missing kid header');
    }

    const key = await this.getVerificationKey(header.kid);

    const { payload } = await jwtVerify(verificationHeader, key, {
      algorithms: [ALLOWED_ALG],
      maxTokenAge: MAX_TOKEN_AGE,
    });

    const expectedHash = payload['request_body_sha256'];
    if (typeof expectedHash !== 'string') {
      throw new Error('Webhook JWT missing request_body_sha256 claim');
    }
    const actualHash = createHash('sha256').update(rawBody).digest('hex');
    if (!this.constantTimeEquals(actualHash, expectedHash)) {
      throw new Error('Webhook body hash mismatch');
    }
  }

  private async getVerificationKey(kid: string): Promise<ImportedKey> {
    const cached = this.keyCache.get(kid);
    if (cached) return cached;

    const response = await this.plaidClient.webhookVerificationKeyGet({
      key_id: kid,
    });
    const plaidKey = response.data.key;

    if (
      plaidKey.expired_at !== null &&
      plaidKey.expired_at !== undefined &&
      plaidKey.expired_at * 1000 < Date.now()
    ) {
      throw new Error(`Plaid verification key ${kid} is expired`);
    }

    const jwk: JWK = {
      kty: plaidKey.kty,
      crv: plaidKey.crv,
      x: plaidKey.x,
      y: plaidKey.y,
      alg: plaidKey.alg,
      use: plaidKey.use,
      kid: plaidKey.kid,
    };
    const imported = await importJWK(jwk, ALLOWED_ALG);
    this.keyCache.set(kid, imported);
    return imported;
  }

  private constantTimeEquals(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    return timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
  }
}
