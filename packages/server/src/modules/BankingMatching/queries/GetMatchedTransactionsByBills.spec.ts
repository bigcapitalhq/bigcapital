import { GetMatchedTransactionsByBills } from './GetMatchedTransactionsByBills.service';

describe('GetMatchedTransactionsByBills', () => {
  const trx = { id: 'trx' } as any;
  let feedRow: Record<string, any>;

  let insert: jest.Mock;
  let createBillPayment: jest.Mock;

  // A thenable lookup chain resolving the given row.
  const buildLookup = (row: any) => {
    const chain: any = {};
    chain.findById = jest.fn(() => chain);
    chain.throwIfNotFound = jest.fn(() => Promise.resolve(row));
    return chain;
  };
  const buildBill = (overrides: Record<string, any> = {}) => ({
    id: 5,
    vendorId: 3,
    branchId: 2,
    dueAmount: 600,
    currencyCode: 'USD',
    exchangeRate: 1,
    ...overrides,
  });
  const buildService = (bill: Record<string, any>) => {
    const billModel = jest.fn(() => ({
      query: jest.fn(() => buildLookup(bill)),
    }));
    const uncategorizedBankTransactionModel = jest.fn(() => ({
      query: jest.fn(() => buildLookup(feedRow)),
    }));
    const service = new GetMatchedTransactionsByBills(
      { createBillPayment } as any,
      { transform: jest.fn() } as any,
      billModel as any,
      uncategorizedBankTransactionModel as any,
    );
    service.matchedBankTransactionModel = jest.fn(() => ({
      query: jest.fn(() => ({ insert })),
    })) as any;
    return service;
  };

  beforeEach(() => {
    feedRow = {
      id: 1,
      accountId: 7,
      amount: -600,
      date: '2024-01-15',
      currencyCode: 'USD',
    };
    insert = jest.fn().mockResolvedValue(1);
    createBillPayment = jest.fn().mockResolvedValue({ id: 40 });
  });

  it("creates the bill payment at the bill's exchange rate", async () => {
    feedRow = { ...feedRow, currencyCode: 'EUR' };
    const service = buildService(
      buildBill({ currencyCode: 'EUR', exchangeRate: 1.25 }),
    );

    await service.createMatchedTransaction(
      [1],
      { referenceType: 'Bill', referenceId: 5 },
      trx,
    );

    expect(createBillPayment).toHaveBeenCalledTimes(1);
    expect(createBillPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        vendorId: 3,
        exchangeRate: 1.25,
        paymentAccountId: 7,
        paymentDate: '2024-01-15',
        entries: [{ paymentAmount: 600, billId: 5 }],
      }),
      trx,
    );
  });

  it('keeps rate 1 for a bill in the base currency', async () => {
    const service = buildService(buildBill());

    await service.createMatchedTransaction(
      [1],
      { referenceType: 'Bill', referenceId: 5 },
      trx,
    );

    expect(createBillPayment.mock.calls[0][0].exchangeRate).toBe(1);
  });

  it('keeps rate 1 when the bank account is in the base currency', async () => {
    const service = buildService(
      buildBill({ currencyCode: 'EUR', exchangeRate: 1.25 }),
    );

    await service.createMatchedTransaction(
      [1],
      { referenceType: 'Bill', referenceId: 5 },
      trx,
    );

    expect(createBillPayment.mock.calls[0][0].exchangeRate).toBe(1);
  });

  it('links the feed row to the bill and to the created bill payment', async () => {
    const service = buildService(buildBill());

    await service.createMatchedTransaction(
      [1],
      { referenceType: 'Bill', referenceId: 5 },
      trx,
    );

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ referenceType: 'Bill', referenceId: 5 }),
    );
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceType: 'BillPayment',
        referenceId: 40,
      }),
    );
  });
});
