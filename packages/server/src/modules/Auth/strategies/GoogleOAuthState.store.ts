import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Cookie that binds an in-flight Google OAuth flow to the browser.
 */
export const GOOGLE_OAUTH_STATE_COOKIE = 'bc_google_oauth_state';

/**
 * How long an OAuth flow may take before the state is rejected.
 */
export const GOOGLE_OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

/**
 * Stateless OAuth `state` store for `passport-oauth2`.
 *
 * The state is a random nonce plus an issuance timestamp signed with the JWT
 * secret. The same value is stored in an http-only cookie on the browser, and
 * the callback is only accepted when both values match. This protects the
 * redirect flow from forged callbacks without requiring session middleware.
 */
@Injectable()
export class GoogleOAuthStateStore {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Creates the state value and binds it to the browser through a cookie.
   */
  public store(
    req: any,
    _meta: any,
    callback: (err: unknown, state: string) => void,
  ): void {
    const nonce = crypto.randomBytes(24).toString('hex');
    const issuedAt = String(Date.now());
    const payload = `${nonce}.${issuedAt}`;
    const state = `${payload}.${this.sign(payload)}`;

    req.res?.cookie?.(GOOGLE_OAUTH_STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.isSecureRequest(req),
      maxAge: GOOGLE_OAUTH_STATE_TTL_MS,
      path: '/api/auth/google',
    });
    callback(null, state);
  }

  /**
   * Verifies that the state returned by Google matches this browser.
   */
  public verify(
    req: any,
    state: string,
    _meta: any,
    callback: (err: unknown, ok: boolean, info?: unknown) => void,
  ): void {
    try {
      const [nonce, issuedAt, signature] = String(state ?? '').split('.');
      const cookieState = this.readCookie(req, GOOGLE_OAUTH_STATE_COOKIE);

      if (!nonce || !issuedAt || !signature || cookieState !== state) {
        return callback(null, false);
      }
      const expected = this.sign(`${nonce}.${issuedAt}`);
      if (!this.safeCompare(signature, expected)) {
        return callback(null, false);
      }
      if (Date.now() - Number(issuedAt) > GOOGLE_OAUTH_STATE_TTL_MS) {
        return callback(null, false);
      }
      req.res?.clearCookie?.(GOOGLE_OAUTH_STATE_COOKIE, {
        path: '/api/auth/google',
      });
      return callback(null, true);
    } catch (_error) {
      return callback(null, false);
    }
  }

  /**
   * Signs the given payload with the application JWT secret.
   */
  private sign(payload: string): string {
    const secret = this.configService.get<string>('jwt.secret') ?? '';
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  /**
   * Constant-time string comparison.
   */
  private safeCompare(left: string, right: string): boolean {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    if (leftBuffer.length !== rightBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(leftBuffer, rightBuffer);
  }

  /**
   * Reads a cookie from the raw request headers (cookie-parser is not used).
   */
  private readCookie(req: any, name: string): string | undefined {
    const header: string | undefined = req?.headers?.cookie;
    if (!header) return undefined;

    for (const part of header.split(';')) {
      const separatorIndex = part.indexOf('=');
      if (separatorIndex === -1) continue;

      const key = part.slice(0, separatorIndex).trim();
      if (key === name) {
        return decodeURIComponent(part.slice(separatorIndex + 1).trim());
      }
    }
    return undefined;
  }

  /**
   * Determines whether the state cookie should be marked as `secure`.
   */
  private isSecureRequest(req: any): boolean {
    if (req?.secure) return true;
    const forwardedProto = req?.headers?.['x-forwarded-proto'];
    return forwardedProto === 'https' || forwardedProto === 'https,http';
  }
}
