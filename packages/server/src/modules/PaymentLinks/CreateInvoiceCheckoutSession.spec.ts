import { CreateInvoiceCheckoutSession } from './CreateInvoiceCheckoutSession';
import {
  ERROR_PAYMENT_LINK_EXPIRED,
  ERROR_PAYMENT_LINK_NOT_SHARED,
} from './payment-link.utils';

const VICTIM_ORG = 'org-victim';
const ATTACKER_ORG = 'org-attacker';
const VICTIM_TENANT_ID = 10;
const INVOICE_ID = 77;
const VICTIM_TOTAL = 2000;
const ATTACKER_TOTAL = 1;

const victimInvoice = {
  id: INVOICE_ID,
  total: VICTIM_TOTAL,
  currencyCode: 'USD',
  invoiceNo: 'INV-VICTIM',
  paymentMethods: [],
};
const attackerInvoice = {
  id: INVOICE_ID,
  total: ATTACKER_TOTAL,
  currencyCode: 'USD',
  invoiceNo: 'INV-ATTACKER',
  paymentMethods: [],
};

const publicLink = {
  id: 5,
  linkId: 'link-public',
  tenantId: VICTIM_TENANT_ID,
  resourceId: INVOICE_ID,
  resourceType: 'SaleInvoice',
  publicity: 'public',
  expiryAt: null,
};

const privateLink = {
  ...publicLink,
  id: 6,
  linkId: 'link-private',
  publicity: 'private',
};

const resolved = (value: any) => {
  const promise: any = Promise.resolve(value);
  promise.throwIfNotFound = () => promise;
  return promise;
};

const createService = ({
  callerOrganizationId = ATTACKER_ORG,
  link = publicLink,
} = {}) => {
  const store: Record<string, any> = {
    organizationId: callerOrganizationId,
  };
  const clsService = {
    get: jest.fn((key: string) => store[key]),
    set: jest.fn((key: string, value: any) => {
      store[key] = value;
    }),
  };
  const invoicesByOrganization: Record<string, any> = {
    [VICTIM_ORG]: victimInvoice,
    [ATTACKER_ORG]: attackerInvoice,
  };
  const saleInvoiceModel = jest.fn(() => ({
    query: () => ({
      findById: () => ({
        withGraphFetched: () =>
          resolved(invoicesByOrganization[store.organizationId]),
      }),
    }),
  }));
  const paymentLinkModel = {
    query: () => ({
      findOne: () => ({
        where: () => resolved(link),
      }),
    }),
  };
  const tenantModel = {
    query: () => ({
      findById: () =>
        Promise.resolve({
          id: VICTIM_TENANT_ID,
          organizationId: VICTIM_ORG,
        }),
    }),
  };
  const stripeCreate = jest.fn().mockResolvedValue({
    id: 'cs_test_123',
    url: 'https://checkout.stripe.com/test',
  });
  const stripePaymentService = {
    stripe: { checkout: { sessions: { create: stripeCreate } } },
  };
  const configService = { get: jest.fn().mockReturnValue('pk_test') };

  const service = new CreateInvoiceCheckoutSession(
    stripePaymentService as any,
    configService as any,
    clsService as any,
    saleInvoiceModel as any,
    paymentLinkModel as any,
    tenantModel as any,
  );
  return { service, store, stripeCreate };
};

describe('CreateInvoiceCheckoutSession', () => {
  it('switches to the payment link tenant before loading the invoice', async () => {
    const { service, store, stripeCreate } = createService();

    const result = await service.createInvoiceCheckoutSession('link-public');

    expect(store.organizationId).toBe(VICTIM_ORG);
    expect(stripeCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [
          expect.objectContaining({
            price_data: expect.objectContaining({
              unit_amount: VICTIM_TOTAL * 100,
              product_data: { name: victimInvoice.invoiceNo },
            }),
          }),
        ],
        metadata: expect.objectContaining({
          saleInvoiceId: INVOICE_ID,
          tenantId: VICTIM_TENANT_ID,
          paymentLinkId: publicLink.id,
        }),
      }),
      { stripeAccount: undefined },
    );
    expect(result).toEqual({
      sessionId: 'cs_test_123',
      publishableKey: 'pk_test',
      redirectTo: 'https://checkout.stripe.com/test',
    });
  });

  it('refuses a private link owned by another organization', async () => {
    const { service, store, stripeCreate } = createService({
      link: privateLink,
    });

    await expect(
      service.createInvoiceCheckoutSession('link-private'),
    ).rejects.toMatchObject({ errorType: ERROR_PAYMENT_LINK_NOT_SHARED });

    expect(store.organizationId).toBe(ATTACKER_ORG);
    expect(stripeCreate).not.toHaveBeenCalled();
  });

  it('refuses an expired link', async () => {
    const { service, stripeCreate } = createService({
      link: { ...publicLink, expiryAt: new Date(Date.now() - 1000) },
    });

    await expect(
      service.createInvoiceCheckoutSession('link-public'),
    ).rejects.toMatchObject({ errorType: ERROR_PAYMENT_LINK_EXPIRED });

    expect(stripeCreate).not.toHaveBeenCalled();
  });

  it('lets the owning organization use its own private link', async () => {
    const { service, store, stripeCreate } = createService({
      callerOrganizationId: VICTIM_ORG,
      link: privateLink,
    });

    await service.createInvoiceCheckoutSession('link-private');

    expect(store.organizationId).toBe(VICTIM_ORG);
    expect(stripeCreate).toHaveBeenCalled();
  });
});
