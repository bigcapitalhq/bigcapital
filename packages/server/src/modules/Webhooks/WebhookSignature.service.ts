import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

@Injectable()
export class WebhookSignatureService {
  /**
   * Generates a Stripe-style signature header.
   * @param {string} payload - Raw JSON payload.
   * @param {string} secret - Webhook secret.
   * @returns {string} Signature header value.
   */
  public generateSignature(payload: string, secret: string): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const signedPayload = `${timestamp}.${payload}`;
    const signature = createHmac('sha256', secret).update(signedPayload).digest('hex');
    return `t=${timestamp},v1=${signature}`;
  }

  /**
   * Verifies a Stripe-style signature header.
   * @param {string} payload - Raw JSON payload.
   * @param {string} secret - Webhook secret.
   * @param {string} header - Signature header value.
   * @returns {boolean}
   */
  public verifySignature(payload: string, secret: string, header: string): boolean {
    const expected = this.generateSignature(payload, secret);
    return expected === header;
  }
}
