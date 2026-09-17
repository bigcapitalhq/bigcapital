import * as moment from 'moment';
import { ServiceError } from '../Items/ServiceError';
import {
  ERROR_PAYMENT_LINK_EXPIRED,
  ERROR_PAYMENT_LINK_NOT_SHARED,
  assertPaymentLinkIsShared,
} from './payment-link.utils';

describe('assertPaymentLinkIsShared', () => {
  it('resolves a shared link without an expiry date', () => {
    expect(() =>
      assertPaymentLinkIsShared({ publicity: 'public', expiryAt: null as any }),
    ).not.toThrow();
  });

  it('resolves a shared link that has not expired yet', () => {
    expect(() =>
      assertPaymentLinkIsShared({
        publicity: 'public',
        expiryAt: moment().add(1, 'day').toDate(),
      }),
    ).not.toThrow();
  });

  it('refuses a link that was never shared', () => {
    expect(() =>
      assertPaymentLinkIsShared({ publicity: 'private', expiryAt: null as any }),
    ).toThrow(
      expect.objectContaining({ errorType: ERROR_PAYMENT_LINK_NOT_SHARED }),
    );
  });

  it('refuses a link with an unknown publicity value', () => {
    expect(() =>
      assertPaymentLinkIsShared({ publicity: '' as any, expiryAt: null as any }),
    ).toThrow(ServiceError);
  });

  it('refuses a shared link that has expired', () => {
    expect(() =>
      assertPaymentLinkIsShared({
        publicity: 'public',
        expiryAt: moment().subtract(1, 'day').toDate(),
      }),
    ).toThrow(
      expect.objectContaining({ errorType: ERROR_PAYMENT_LINK_EXPIRED }),
    );
  });
});
