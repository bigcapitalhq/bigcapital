import * as moment from 'moment';
import { ServiceError } from '../Items/ServiceError';
import { PaymentLink } from './models/PaymentLink';

export const ERROR_PAYMENT_LINK_NOT_SHARED = 'PAYMENT_LINK_NOT_SHARED';
export const ERROR_PAYMENT_LINK_EXPIRED = 'PAYMENT_LINK_EXPIRED';

/**
 * Payment links are resolved across tenants by their link id alone, so the link
 * itself is the only credential. It may only be resolved while it is shared and
 * unexpired. `publicity` defaults to `private`, which means a link that was
 * generated but never shared must not resolve.
 */
export function assertPaymentLinkIsShared(
  paymentLink: Pick<PaymentLink, 'publicity' | 'expiryAt'>,
): void {
  if (paymentLink.publicity !== 'public') {
    throw new ServiceError(ERROR_PAYMENT_LINK_NOT_SHARED);
  }
  if (paymentLink.expiryAt && moment(paymentLink.expiryAt).isBefore(moment())) {
    throw new ServiceError(ERROR_PAYMENT_LINK_EXPIRED);
  }
}
