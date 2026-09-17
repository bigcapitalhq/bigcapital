import * as moment from 'moment';
import { ServiceError } from '../Items/ServiceError';
import { PaymentLink } from './models/PaymentLink';

export const ERROR_PAYMENT_LINK_NOT_SHARED = 'PAYMENT_LINK_NOT_SHARED';
export const ERROR_PAYMENT_LINK_EXPIRED = 'PAYMENT_LINK_EXPIRED';

/**
 * Payment links are looked up across tenants by their link id, and the request
 * is then switched to the tenant that owns the link. Decide here whether the
 * caller may follow that switch: a link that was shared is readable by anyone,
 * any other link only by the organization it belongs to.
 */
export function assertPaymentLinkAccessible(
  paymentLink: Pick<PaymentLink, 'publicity' | 'expiryAt'>,
  linkOrganizationId: string,
  callerOrganizationId: string | undefined,
): void {
  if (paymentLink.expiryAt && moment(paymentLink.expiryAt).isBefore(moment())) {
    throw new ServiceError(ERROR_PAYMENT_LINK_EXPIRED);
  }
  if (paymentLink.publicity === 'public') {
    return;
  }
  if (callerOrganizationId && callerOrganizationId === linkOrganizationId) {
    return;
  }
  throw new ServiceError(ERROR_PAYMENT_LINK_NOT_SHARED);
}
