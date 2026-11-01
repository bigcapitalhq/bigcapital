import * as moment from 'moment';
import {
  ERROR_PAYMENT_LINK_EXPIRED,
  ERROR_PAYMENT_LINK_NOT_SHARED,
  assertPaymentLinkAccessible,
} from './payment-link.utils';

const OWNER = 'org-that-owns-the-link';
const OTHER = 'some-other-org';
const later = moment().add(1, 'day').toDate();
const earlier = moment().subtract(1, 'day').toDate();

describe('assertPaymentLinkAccessible', () => {
  it('lets the owning organization read its own link', () => {
    expect(() =>
      assertPaymentLinkAccessible(
        { publicity: 'private', expiryAt: null as any },
        OWNER,
        OWNER,
      ),
    ).not.toThrow();
  });

  it('lets anyone read a shared link', () => {
    expect(() =>
      assertPaymentLinkAccessible(
        { publicity: 'public', expiryAt: null as any },
        OWNER,
        OTHER,
      ),
    ).not.toThrow();
  });

  it('refuses another organization on a link that was not shared', () => {
    expect(() =>
      assertPaymentLinkAccessible(
        { publicity: 'private', expiryAt: null as any },
        OWNER,
        OTHER,
      ),
    ).toThrow(
      expect.objectContaining({ errorType: ERROR_PAYMENT_LINK_NOT_SHARED }),
    );
  });

  it('refuses a caller without an organization on a link that was not shared', () => {
    expect(() =>
      assertPaymentLinkAccessible(
        { publicity: 'private', expiryAt: null as any },
        OWNER,
        undefined,
      ),
    ).toThrow(
      expect.objectContaining({ errorType: ERROR_PAYMENT_LINK_NOT_SHARED }),
    );
  });

  it('refuses an expired shared link', () => {
    expect(() =>
      assertPaymentLinkAccessible(
        { publicity: 'public', expiryAt: earlier },
        OWNER,
        OTHER,
      ),
    ).toThrow(
      expect.objectContaining({ errorType: ERROR_PAYMENT_LINK_EXPIRED }),
    );
  });

  it('refuses an expired link even for the owning organization', () => {
    expect(() =>
      assertPaymentLinkAccessible(
        { publicity: 'private', expiryAt: earlier },
        OWNER,
        OWNER,
      ),
    ).toThrow(
      expect.objectContaining({ errorType: ERROR_PAYMENT_LINK_EXPIRED }),
    );
  });

  it('keeps a shared link that has not expired readable', () => {
    expect(() =>
      assertPaymentLinkAccessible(
        { publicity: 'public', expiryAt: later },
        OWNER,
        OTHER,
      ),
    ).not.toThrow();
  });
});
