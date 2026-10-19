import { PaymentReceivedCostGLEntries } from './PaymentReceivedCostGLEntries';
import { PaymentReceived } from '../models/PaymentReceived';

interface TestCostLot {
  transactionId: number;
  itemId: number;
  cost: number;
  costAccountId?: number | null;
  item: { id: number; costAccountId: number; inventoryAccountId: number };
  itemEntry?: { description: string } | null;
}

interface TestInvoice {
  id: number;
  totalLocal: number;
}

const buildCostLot = (overrides: Partial<TestCostLot> = {}): TestCostLot => ({
  transactionId: 10,
  itemId: 1,
  cost: 600,
  costAccountId: null,
  item: { id: 1, costAccountId: 400, inventoryAccountId: 500 },
  itemEntry: { description: 'Item description' },
  ...overrides,
});

const buildInvoice = (overrides: Partial<TestInvoice> = {}): TestInvoice => ({
  id: 10,
  totalLocal: 1000,
  ...overrides,
});

const buildPayment = (
  entries: any[],
  overrides: Record<string, any> = {},
): PaymentReceived =>
  ({
    id: 1,
    paymentReceiveNo: 'PAY-00001',
    referenceNo: 'REF-00001',
    paymentDate: '2024-01-01',
    currencyCode: 'USD',
    exchangeRate: 1,
    userId: 1,
    branchId: 1,
    createdAt: '2024-01-01',
    entries,
    ...overrides,
  }) as unknown as PaymentReceived;

const buildPaymentEntry = (invoice: TestInvoice, paymentAmount: number) => ({
  invoiceId: invoice.id,
  paymentAmount,
  invoice,
});

const buildQueryBuilder = (result: unknown) => {
  const builder: any = {
    where: jest.fn(() => builder),
    whereIn: jest.fn(() => builder),
    findById: jest.fn(() => builder),
    withGraphFetched: jest.fn(() => builder),
    then: (resolve: (value: unknown) => unknown) =>
      Promise.resolve(result).then(resolve),
  };
  return builder;
};

const buildService = (costLots: TestCostLot[], payment?: any) => {
  const ledgerStorage = { commit: jest.fn() };
  const lotsBuilder = buildQueryBuilder(costLots);
  const paymentBuilder = buildQueryBuilder(payment);

  const service = new PaymentReceivedCostGLEntries(
    ledgerStorage as any,
    (() => ({ query: () => lotsBuilder })) as any,
    (() => ({ query: () => paymentBuilder })) as any,
  );

  return { service, ledgerStorage, lotsBuilder };
};

const findEntries = (entries: any[], accountId: number) =>
  entries.filter((entry) => entry.accountId === accountId);

describe('PaymentReceivedCostGLEntries', () => {
  it('records Dr cost / Cr inventory for a full payment', async () => {
    const { service } = buildService([buildCostLot()]);
    const payment = buildPayment([
      buildPaymentEntry(buildInvoice({ totalLocal: 1000 }), 1000),
    ]);

    const ledger = await service.getPaymentCostLedger(payment);
    const entries = ledger.getEntries();

    expect(entries).toHaveLength(2);

    const costEntry = findEntries(entries, 400)[0];
    expect(costEntry.debit).toBe(600);
    expect(costEntry.credit).toBe(0);
    expect(costEntry.accountNormal).toBe('debit');

    const inventoryEntry = findEntries(entries, 500)[0];
    expect(inventoryEntry.credit).toBe(600);
    expect(inventoryEntry.debit).toBe(0);
  });

  it('flags the entries as cash basis and costable', async () => {
    const { service } = buildService([buildCostLot()]);
    const payment = buildPayment([
      buildPaymentEntry(buildInvoice({ totalLocal: 1000 }), 1000),
    ]);

    const ledger = await service.getPaymentCostLedger(payment);
    const entries = ledger.getEntries();

    entries.forEach((entry) => {
      expect(entry.basis).toBe('cash');
      expect(entry.costable).toBe(true);
      expect(entry.indexGroup).toBe(60);
      expect(entry.transactionType).toBe('PaymentReceive');
      expect(entry.transactionId).toBe(payment.id);
      expect(entry.date).toBe(payment.paymentDate);
    });
  });

  it('scales the inventory cost by the paid proportion of the invoice', async () => {
    const { service } = buildService([buildCostLot()]);
    const payment = buildPayment([
      buildPaymentEntry(buildInvoice({ totalLocal: 1000 }), 400),
    ]);

    const ledger = await service.getPaymentCostLedger(payment);
    const entries = ledger.getEntries();

    expect(findEntries(entries, 400)[0].debit).toBe(240);
    expect(findEntries(entries, 500)[0].credit).toBe(240);
  });

  it('scales the inventory cost by the payment exchange rate', async () => {
    const { service } = buildService([buildCostLot()]);
    const payment = buildPayment(
      [buildPaymentEntry(buildInvoice({ totalLocal: 1200 }), 500)],
      { exchangeRate: 1.2 },
    );

    const ledger = await service.getPaymentCostLedger(payment);
    const entries = ledger.getEntries();

    expect(findEntries(entries, 400)[0].debit).toBe(300);
    expect(findEntries(entries, 500)[0].credit).toBe(300);
  });

  it('records the entries of multiple items and invoices', async () => {
    const { service } = buildService([
      buildCostLot({ transactionId: 10, itemId: 1, cost: 600 }),
      buildCostLot({
        transactionId: 10,
        itemId: 2,
        cost: 300,
        item: { id: 2, costAccountId: 401, inventoryAccountId: 501 },
      }),
      buildCostLot({
        transactionId: 11,
        itemId: 1,
        cost: 100,
        item: { id: 1, costAccountId: 400, inventoryAccountId: 500 },
      }),
    ]);
    const payment = buildPayment([
      buildPaymentEntry(buildInvoice({ id: 10, totalLocal: 1000 }), 500),
      buildPaymentEntry(buildInvoice({ id: 11, totalLocal: 200 }), 100),
    ]);

    const ledger = await service.getPaymentCostLedger(payment);
    const entries = ledger.getEntries();

    expect(entries).toHaveLength(6);
    expect(findEntries(entries, 400)[0].debit).toBe(300);
    expect(findEntries(entries, 401)[0].debit).toBe(150);
    expect(findEntries(entries, 500)[0].credit).toBe(300);
    expect(findEntries(entries, 501)[0].credit).toBe(150);
    expect(findEntries(entries, 400)[1].debit).toBe(50);
  });

  it('prefers the cost lot cost account over the item cost account', async () => {
    const { service } = buildService([buildCostLot({ costAccountId: 450 })]);
    const payment = buildPayment([
      buildPaymentEntry(buildInvoice({ totalLocal: 1000 }), 1000),
    ]);

    const ledger = await service.getPaymentCostLedger(payment);
    const entries = ledger.getEntries();

    expect(findEntries(entries, 450)[0].debit).toBe(600);
  });

  it('returns an empty ledger when the invoice has no cost lots', async () => {
    const { service } = buildService([]);
    const payment = buildPayment([
      buildPaymentEntry(buildInvoice({ totalLocal: 1000 }), 1000),
    ]);

    const ledger = await service.getPaymentCostLedger(payment);

    expect(ledger.isEmpty()).toBe(true);
  });

  it('does not commit an empty ledger', async () => {
    const { service, ledgerStorage } = buildService([], {
      ...buildPayment([]),
      entries: [],
    });

    await service.writePaymentCostGLEntries(1);

    expect(ledgerStorage.commit).not.toHaveBeenCalled();
  });

  it('commits the ledger when the payment has cost lots', async () => {
    const payment = buildPayment([
      buildPaymentEntry(buildInvoice({ totalLocal: 1000 }), 1000),
    ]);
    const { service, ledgerStorage } = buildService([buildCostLot()], payment);

    await service.writePaymentCostGLEntries(1);

    expect(ledgerStorage.commit).toHaveBeenCalledTimes(1);
    const committedLedger = ledgerStorage.commit.mock.calls[0][0];
    expect(committedLedger.getEntries()).toHaveLength(2);
  });
});
