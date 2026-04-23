import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';

/**
 * Verifies the `x-square-hmacsha256-signature` header for an inbound
 * webhook. Square signs HMAC-SHA256(notification_url + raw_body) with the
 * webhook subscription's signing key, then base64-encodes.
 *
 * `notificationUrl` must be the full URL the event was delivered to
 * (including scheme + host + path + any query). We reconstruct it from
 * the request at the controller level.
 */
@Injectable()
export class VerifySquareSignature {
  public verify(
    rawBody: string | Buffer,
    notificationUrl: string,
    signatureHeader: string | undefined,
    signingKey: string,
  ): boolean {
    if (!signatureHeader) return false;
    const body =
      typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
    const expected = crypto
      .createHmac('sha256', signingKey)
      .update(notificationUrl + body)
      .digest('base64');
    // Timing-safe compare; bail early if lengths differ so Buffer.compare
    // below doesn't throw.
    if (expected.length !== signatureHeader.length) return false;
    try {
      return crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(signatureHeader),
      );
    } catch {
      return false;
    }
  }
}
