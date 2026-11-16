import { GetMatchedTransactionsByInvoices } from './GetMatchedTransactionsByInvoices.service';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';

describe('GetMatchedTransactionsByInvoices', () => {
  const trx = { id: 'trx' } as any;
  let feedRow: Record<string, any>;

  let insert: jest.Mock;
  let createPaymentReceived: jest.Mock;
  let invoiceQuery: jest.SpyInstance;
  let service: GetMatchedTransactionsByInvoices;

  // A thenable lookup chain resolving the given row.
  const buildLookup = (row: any) => {
    const chain: any = {};
    chain.findById = jest.fn(() => chain);
    chain.throwIfNotFound = jest.fn(() => Promise.resolve(row));
    return chain;
  };
  const mockInvoice = (invoice: Record<string, any>) => {
    invoiceQuery = jest
      .spyOn(SaleInvoice, 'query')
      .mockReturnValue(buildLookup(invoice));
  };
  const buildInvoice = (overrides: Record<string, any> = {}) => ({
    id: 5,
    customerId: 3,
    branchId: 2,
    dueAmount: 800,
    currencyCode: 'USD',
    exchangeRate: 1,
    ...overrides,
  });

  beforeEach(() => {
    feedRow = {
      id: 1,
      accountId: 7,
      amount: 800,
      date: '2024-01-15',
      currencyCode: 'USD',
    };
    insert = jest.fn().mockResolvedValue(1);
    createPaymentReceived = jest.fn().mockResolvedValue({ id: 40 });

    const uncategorizedBankTransactionModel = jest.fn(() => ({
      query: jest.fn(() => buildLookup(feedRow)),
    }));
    service = new GetMatchedTransactionsByInvoices(
      { transform: jest.fn() } as any,
      { createPaymentReceived } as any,
      jest.fn() as any,
      uncategorizedBankTransactionModel as any,
    );
    service.matchedBankTransactionModel = jest.fn(() => ({
      query: jest.fn(() => ({ insert })),
    })) as any;
  });

  afterEach(() => {
    invoiceQuery?.mockRestore();
  });

  it("creates the payment at the invoice's exchange rate", async () => {
    feedRow = { ...feedRow, currencyCode: 'EUR' };
    mockInvoice(buildInvoice({ currencyCode: 'EUR', exchangeRate: 1.25 }));

    await service.createMatchedTransaction(
      [1],
      { referenceType: 'SaleInvoice', referenceId: 5 },
      trx,
    );

    expect(createPaymentReceived).toHaveBeenCalledTimes(1);
    expect(createPaymentReceived).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 3,
        amount: 800,
        exchangeRate: 1.25,
        depositAccountId: 7,
        paymentDate: '2024-01-15',
        entries: [{ index: 1, invoiceId: 5, paymentAmount: 800 }],
      }),
      trx,
    );
  });

  it('keeps rate 1 for an invoice in the base currency', async () => {
    mockInvoice(buildInvoice());

    await service.createMatchedTransaction(
      [1],
      { referenceType: 'SaleInvoice', referenceId: 5 },
      trx,
    );

    expect(createPaymentReceived.mock.calls[0][0].exchangeRate).toBe(1);
  });

  it('keeps rate 1 when the bank account is in the base currency', async () => {
    mockInvoice(buildInvoice({ currencyCode: 'EUR', exchangeRate: 1.25 }));

    await service.createMatchedTransaction(
      [1],
      { referenceType: 'SaleInvoice', referenceId: 5 },
      trx,
    );

    expect(createPaymentReceived.mock.calls[0][0].exchangeRate).toBe(1);
  });

  it('links the feed row to the invoice and to the created payment', async () => {
    mockInvoice(buildInvoice());

    await service.createMatchedTransaction(
      [1],
      { referenceType: 'SaleInvoice', referenceId: 5 },
      trx,
    );

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ referenceType: 'SaleInvoice', referenceId: 5 }),
    );
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceType: 'PaymentReceive',
        referenceId: 40,
      }),
    );
  });
});
