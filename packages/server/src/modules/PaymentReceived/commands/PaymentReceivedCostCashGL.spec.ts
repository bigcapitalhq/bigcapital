import {
  PaymentReceivedCostCashGL,
  IInvoiceItemCost,
} from './PaymentReceivedCostCashGL';
import { PaymentReceived } from '../models/PaymentReceived';
import { AccountingBasis } from '@/common/types/AccountingBasis';

interface TestInvoice {
  id: number;
  exchangeRate: number;
  totalLocal: number;
}

interface TestPaymentEntry {
  invoiceId: number;
  paymentAmount: number;
  invoice?: TestInvoice;
}

const buildInvoice = (overrides: Partial<TestInvoice> = {}): TestInvoice => ({
  id: 10,
  exchangeRate: 1,
  totalLocal: 1000,
  ...overrides,
});

const buildPayment = (
  entries: TestPaymentEntry[],
  overrides: Partial<PaymentReceived> = {},
) =>
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
    depositAccountId: 100,
    customerId: 5,
    entries,
    ...overrides,
  }) as unknown as PaymentReceived;

const buildPaymentEntry = (
  invoice: TestInvoice,
  paymentAmount: number,
): TestPaymentEntry => ({
  invoiceId: invoice.id,
  paymentAmount,
  invoice,
});

const buildItemCost = (
  overrides: Partial<IInvoiceItemCost> = {},
): IInvoiceItemCost => ({
  itemId: 1,
  cost: 400,
  costAccountId: 600,
  inventoryAccountId: 700,
  description: 'Item description',
  ...overrides,
});

const buildGL = (payment: PaymentReceived, invoicesItemCosts) =>
  new PaymentReceivedCostCashGL(payment).setInvoicesItemCosts(
    invoicesItemCosts,
  );

const findEntry = (entries: any[], accountId: number) =>
  entries.find((entry) => entry.accountId === accountId);

describe('PaymentReceivedCostCashGL', () => {
  it('records Dr COGS / Cr inventory of the full invoice cost for a fully paid invoice', () => {
    const invoice = buildInvoice({ id: 10, totalLocal: 1000 });
    const payment = buildPayment([buildPaymentEntry(invoice, 1000)]);
    const invoicesItemCosts = {
      10: [buildItemCost({ cost: 400 })],
    };

    const entries = buildGL(payment, invoicesItemCosts).GLEntries();

    expect(entries).toHaveLength(2);

    const costEntry = findEntry(entries, 600);
    expect(costEntry.debit).toBe(400);
    expect(costEntry.credit).toBe(0);
    expect(costEntry.accountNormal).toBe('debit');
    expect(costEntry.itemId).toBe(1);

    const inventoryEntry = findEntry(entries, 700);
    expect(inventoryEntry.credit).toBe(400);
    expect(inventoryEntry.debit).toBe(0);
    expect(inventoryEntry.accountNormal).toBe('debit');
  });

  it('flags the entries as cash basis costable with its own index group', () => {
    const invoice = buildInvoice({ id: 10, totalLocal: 1000 });
    const payment = buildPayment([buildPaymentEntry(invoice, 1000)]);
    const invoicesItemCosts = {
      10: [buildItemCost({ cost: 400 })],
    };

    const entries = buildGL(payment, invoicesItemCosts).GLEntries();

    entries.forEach((entry) => {
      expect(entry.basis).toBe(AccountingBasis.Cash);
      expect(entry.costable).toBe(true);
      expect(entry.indexGroup).toBe(60);
      expect(entry.transactionType).toBe('PaymentReceive');
      expect(entry.transactionId).toBe(payment.id);
      expect(entry.date).toBe('2024-01-01');
    });
  });

  it('recognizes the cost proportionally for a partial payment', () => {
    const invoice = buildInvoice({ id: 10, totalLocal: 1000 });
    const payment = buildPayment([buildPaymentEntry(invoice, 400)]);
    const invoicesItemCosts = {
      10: [buildItemCost({ cost: 400 })],
    };

    const entries = buildGL(payment, invoicesItemCosts).GLEntries();

    expect(findEntry(entries, 600).debit).toBe(160);
    expect(findEntry(entries, 700).credit).toBe(160);
  });

  it('mirrors the cost of each invoice item and keeps the entries balanced', () => {
    const invoice = buildInvoice({ id: 10, totalLocal: 2000 });
    const payment = buildPayment([buildPaymentEntry(invoice, 2000)]);
    const invoicesItemCosts = {
      10: [
        buildItemCost({ itemId: 1, cost: 400, costAccountId: 600 }),
        buildItemCost({
          itemId: 2,
          cost: 260,
          costAccountId: 601,
          inventoryAccountId: 701,
          description: null,
        }),
      ],
    };

    const entries = buildGL(payment, invoicesItemCosts).GLEntries();

    expect(entries).toHaveLength(4);
    expect(findEntry(entries, 600).debit).toBe(400);
    expect(findEntry(entries, 601).debit).toBe(260);
    expect(findEntry(entries, 700).credit).toBe(400);
    expect(findEntry(entries, 701).credit).toBe(260);

    const totalDebit = entries.reduce((total, entry) => total + entry.debit, 0);
    const totalCredit = entries.reduce(
      (total, entry) => total + entry.credit,
      0,
    );
    expect(totalDebit).toBeCloseTo(totalCredit, 2);
  });

  it('records the cost of each invoice of a multi-invoices payment', () => {
    const invoiceA = buildInvoice({ id: 10, totalLocal: 1000 });
    const invoiceB = buildInvoice({ id: 11, totalLocal: 500 });
    const payment = buildPayment([
      buildPaymentEntry(invoiceA, 1000),
      buildPaymentEntry(invoiceB, 500),
    ]);
    const invoicesItemCosts = {
      10: [buildItemCost({ cost: 400, costAccountId: 600 })],
      11: [buildItemCost({ cost: 200, costAccountId: 601 })],
    };

    const entries = buildGL(payment, invoicesItemCosts).GLEntries();

    expect(entries).toHaveLength(4);
    expect(findEntry(entries, 600).debit).toBe(400);
    expect(findEntry(entries, 601).debit).toBe(200);
  });

  it('aggregates the item costs over the invoice cost lots', () => {
    const invoice = buildInvoice({ id: 10, totalLocal: 1000 });
    const payment = buildPayment([buildPaymentEntry(invoice, 1000)]);
    const invoicesItemCosts = {
      10: [buildItemCost({ itemId: 1, cost: 400 + 160 })],
    };

    const entries = buildGL(payment, invoicesItemCosts).GLEntries();

    expect(entries).toHaveLength(2);
    expect(findEntry(entries, 600).debit).toBe(560);
    expect(findEntry(entries, 700).credit).toBe(560);
  });

  it('skips the invoices without inventory cost lots', () => {
    const invoiceA = buildInvoice({ id: 10, totalLocal: 1000 });
    const invoiceB = buildInvoice({ id: 11, totalLocal: 500 });
    const payment = buildPayment([
      buildPaymentEntry(invoiceA, 1000),
      buildPaymentEntry(invoiceB, 500),
    ]);
    const invoicesItemCosts = {};

    const entries = buildGL(payment, invoicesItemCosts).GLEntries();

    expect(entries).toHaveLength(0);
  });

  it('skips zero paid proportions', () => {
    const invoice = buildInvoice({ id: 10, totalLocal: 0 });
    const payment = buildPayment([buildPaymentEntry(invoice, 1000)]);
    const invoicesItemCosts = {
      10: [buildItemCost({ cost: 400 })],
    };

    const entries = buildGL(payment, invoicesItemCosts).GLEntries();

    expect(entries).toHaveLength(0);
  });
});
