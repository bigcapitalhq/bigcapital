import { PaymentReceivedCashGL } from './PaymentReceivedCashGL';
import { PaymentReceived } from '../models/PaymentReceived';
import { AccountingBasis } from '@/common/types/AccountingBasis';

interface TestItemEntry {
  itemId?: number;
  description?: string;
  sellAccountId: number;
  totalExcludingTax: number;
  taxAmount?: number;
  taxRateId?: number | null;
  taxRate?: number;
}

interface TestInvoice {
  id: number;
  exchangeRate: number;
  totalLocal: number;
  entries: TestItemEntry[];
  discountAmountLocal?: number | null;
  adjustmentLocal?: number | null;
}

const buildItemEntry = (
  overrides: Partial<TestItemEntry> = {},
): TestItemEntry => ({
  itemId: 1,
  description: 'Item description',
  sellAccountId: 500,
  totalExcludingTax: 1000,
  taxAmount: 0,
  taxRateId: null,
  taxRate: 0,
  ...overrides,
});

const buildInvoice = (
  entries: TestItemEntry[],
  overrides: Partial<TestInvoice> = {},
): TestInvoice => ({
  id: 10,
  exchangeRate: 1,
  totalLocal: entries.reduce(
    (total, entry) => total + entry.totalExcludingTax + (entry.taxAmount || 0),
    0,
  ),
  discountAmountLocal: null,
  adjustmentLocal: null,
  entries,
  ...overrides,
});

const buildPayment = () =>
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
    entries: [],
  }) as unknown as PaymentReceived;

const buildPaymentEntry = (invoice: TestInvoice, paymentAmount: number) => ({
  invoiceId: invoice.id,
  paymentAmount,
  invoice,
});

const buildGL = (payment: PaymentReceived) =>
  new PaymentReceivedCashGL(payment)
    .setTaxPayableAccountId(200)
    .setDiscountAccountId(300)
    .setOtherChargesAccountId(400);

const findEntry = (entries: any[], accountId: number) =>
  entries.find((entry) => entry.accountId === accountId);

describe('PaymentReceivedCashGL', () => {
  it('records Dr deposit / Cr income for a full tax-free payment', () => {
    const invoice = buildInvoice([buildItemEntry()], { totalLocal: 1000 });
    const payment = {
      ...buildPayment(),
      entries: [buildPaymentEntry(invoice, 1000)],
    } as unknown as PaymentReceived;

    const entries = buildGL(payment).GLEntries();

    expect(entries).toHaveLength(2);

    const depositEntry = findEntry(entries, 100);
    expect(depositEntry.debit).toBe(1000);
    expect(depositEntry.credit).toBe(0);
    expect(depositEntry.accountNormal).toBe('debit');

    const incomeEntry = findEntry(entries, 500);
    expect(incomeEntry.credit).toBe(1000);
    expect(incomeEntry.debit).toBe(0);
    expect(incomeEntry.accountNormal).toBe('credit');
  });

  it('flags the entries as cash basis with its own index group', () => {
    const invoice = buildInvoice([buildItemEntry()], { totalLocal: 1000 });
    const payment = {
      ...buildPayment(),
      entries: [buildPaymentEntry(invoice, 1000)],
    } as unknown as PaymentReceived;

    const entries = buildGL(payment).GLEntries();

    entries.forEach((entry) => {
      expect(entry.basis).toBe(AccountingBasis.Cash);
      expect(entry.indexGroup).toBe(50);
      expect(entry.transactionType).toBe('PaymentReceive');
      expect(entry.transactionId).toBe(payment.id);
    });
  });

  it('mirrors the invoice tax payable for a tax-exclusive invoice', () => {
    const invoice = buildInvoice(
      [
        buildItemEntry({
          totalExcludingTax: 1000,
          taxAmount: 100,
          taxRateId: 7,
          taxRate: 10,
        }),
      ],
      { totalLocal: 1100 },
    );
    const payment = {
      ...buildPayment(),
      entries: [buildPaymentEntry(invoice, 1100)],
    } as unknown as PaymentReceived;

    const entries = buildGL(payment).GLEntries();

    expect(entries).toHaveLength(3);
    expect(findEntry(entries, 100).debit).toBe(1100);
    expect(findEntry(entries, 500).credit).toBe(1000);

    const taxEntry = findEntry(entries, 200);
    expect(taxEntry.credit).toBe(100);
    expect(taxEntry.taxRateId).toBe(7);
    expect(taxEntry.taxRate).toBe(10);
  });

  it('recognizes the income proportionally for a partial payment', () => {
    const invoice = buildInvoice([buildItemEntry()], { totalLocal: 1000 });
    const payment = {
      ...buildPayment(),
      entries: [buildPaymentEntry(invoice, 400)],
    } as unknown as PaymentReceived;

    const entries = buildGL(payment).GLEntries();

    expect(findEntry(entries, 100).debit).toBe(400);
    expect(findEntry(entries, 500).credit).toBe(400);
  });

  it('mirrors the invoice discount and adjustment entries', () => {
    const invoice = buildInvoice([buildItemEntry()], {
      totalLocal: 950,
      discountAmountLocal: 100,
      adjustmentLocal: 50,
    });
    const payment = {
      ...buildPayment(),
      entries: [buildPaymentEntry(invoice, 950)],
    } as unknown as PaymentReceived;

    const entries = buildGL(payment).GLEntries();

    expect(entries).toHaveLength(4);
    expect(findEntry(entries, 100).debit).toBe(950);
    expect(findEntry(entries, 500).credit).toBe(1000);
    expect(findEntry(entries, 300).debit).toBe(100);
    expect(findEntry(entries, 400).credit).toBe(50);
  });

  it('records the income of each invoice of a multi-invoices payment', () => {
    const invoiceA = buildInvoice([buildItemEntry({ sellAccountId: 500 })], {
      id: 10,
      totalLocal: 1000,
    });
    const invoiceB = buildInvoice(
      [buildItemEntry({ sellAccountId: 501, totalExcludingTax: 500 })],
      {
        id: 11,
        totalLocal: 500,
      },
    );
    const payment = {
      ...buildPayment(),
      entries: [
        buildPaymentEntry(invoiceA, 1000),
        buildPaymentEntry(invoiceB, 500),
      ],
    } as unknown as PaymentReceived;

    const entries = buildGL(payment).GLEntries();

    expect(entries).toHaveLength(4);
    expect(findEntry(entries, 500).credit).toBe(1000);
    expect(findEntry(entries, 501).credit).toBe(500);
    expect(
      entries
        .filter((entry) => entry.accountId === 100)
        .reduce((total, entry) => total + entry.debit, 0),
    ).toBe(1500);
  });

  it('keeps the cash basis entries balanced', () => {
    const invoice = buildInvoice(
      [
        buildItemEntry({ totalExcludingTax: 1000, taxAmount: 100 }),
        buildItemEntry({
          sellAccountId: 501,
          totalExcludingTax: 500,
          taxAmount: 50,
        }),
      ],
      { id: 10, totalLocal: 1550, discountAmountLocal: 100 },
    );
    const payment = {
      ...buildPayment(),
      entries: [buildPaymentEntry(invoice, 825)],
    } as unknown as PaymentReceived;

    const entries = buildGL(payment).GLEntries();

    const totalDebit = entries.reduce((total, entry) => total + entry.debit, 0);
    const totalCredit = entries.reduce(
      (total, entry) => total + entry.credit,
      0,
    );
    expect(totalDebit).toBeCloseTo(totalCredit, 2);
    expect(findEntry(entries, 100).debit).toBe(825);
  });
});
