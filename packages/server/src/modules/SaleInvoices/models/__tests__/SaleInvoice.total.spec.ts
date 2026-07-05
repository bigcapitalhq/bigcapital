import { SaleInvoice } from '../SaleInvoice';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { InvoiceGL } from '../../ledger/InvoiceGL';
import { DiscountType } from '@/common/types/Discount';

const makeInvoice = (attrs: Partial<SaleInvoice>): SaleInvoice => {
  return Object.assign(new SaleInvoice(), {
    exchangeRate: 1,
    currencyCode: 'NZD',
    paymentAmount: 0,
    writtenoffAmount: 0,
    creditedAmount: 0,
    taxAmountWithheld: 0,
    discount: 0,
    adjustment: 0,
    ...attrs,
  });
};

const makeEntry = (attrs: Partial<ItemEntry>): ItemEntry => {
  return Object.assign(new ItemEntry(), {
    discount: 0,
    ...attrs,
  });
};

describe('SaleInvoice total (tax handling)', () => {
  it('adds withheld tax to total when tax is EXCLUSIVE', () => {
    const invoice = makeInvoice({
      balance: 18975, // subtotal excluding tax (stored in the `balance` column)
      taxAmountWithheld: 2846.25,
      isInclusiveTax: false,
    });
    expect(invoice.total).toBeCloseTo(21821.25, 2);
    expect(invoice.totalLocal).toBeCloseTo(21821.25, 2);
    expect(invoice.subtotalExludingTax).toBeCloseTo(18975, 2);
  });

  it('does NOT add withheld tax again when tax is INCLUSIVE', () => {
    const invoice = makeInvoice({
      balance: 21821.25, // subtotal already including tax
      taxAmountWithheld: 2846.25,
      isInclusiveTax: true,
    });
    expect(invoice.total).toBeCloseTo(21821.25, 2);
    expect(invoice.subtotalExludingTax).toBeCloseTo(18975, 2);
  });

  it('keeps total = subtotal when there is no tax', () => {
    const invoice = makeInvoice({ balance: 1000, isInclusiveTax: false });
    expect(invoice.total).toBeCloseTo(1000, 2);
  });

  it('applies discount and adjustment on top of the tax-included total', () => {
    const invoice = makeInvoice({
      balance: 1000,
      taxAmountWithheld: 150,
      isInclusiveTax: false,
      discount: 100,
      discountType: DiscountType.Amount,
      adjustment: 50,
    });
    // (1000 + 150) - 100 + 50
    expect(invoice.total).toBeCloseTo(1100, 2);
  });

  it('due amount derives from the tax-included total', () => {
    const invoice = makeInvoice({
      balance: 18975,
      taxAmountWithheld: 2846.25,
      isInclusiveTax: false,
      paymentAmount: 18026.25, // net bank payment
    });
    // Remaining due should be the withheld portion (3,795.00).
    expect(invoice.dueAmount).toBeCloseTo(3795.0, 2);
  });
});

describe('InvoiceGL balanced entries', () => {
  const sumDebits = (entries: any[]) =>
    entries.reduce((s, e) => s + (e.debit || 0), 0);
  const sumCredits = (entries: any[]) =>
    entries.reduce((s, e) => s + (e.credit || 0), 0);

  const buildGL = (invoice: SaleInvoice) => {
    const gl = new InvoiceGL(invoice);
    gl.setARAccountId(1006);
    gl.setTaxPayableAccountId(1013);
    gl.setDiscountAccountId(1031);
    gl.setOtherChargesAccountId(1033);
    return gl.getInvoiceGLEntries();
  };

  it('debits equal credits for an EXCLUSIVE-tax invoice', () => {
    const entry = makeEntry({
      quantity: 165,
      rate: 115,
      taxRate: 15,
      taxRateId: 5,
      isInclusiveTax: 0,
      sellAccountId: 1026,
    });
    const invoice = makeInvoice({
      balance: entry.amount, // 18,975
      taxAmountWithheld: entry.taxAmount, // 2,846.25
      isInclusiveTax: false,
      entries: [entry],
    });
    const entries = buildGL(invoice);

    expect(sumDebits(entries)).toBeCloseTo(sumCredits(entries), 2);
    expect(sumDebits(entries)).toBeCloseTo(21821.25, 2);
  });

  it('debits equal credits for an INCLUSIVE-tax invoice', () => {
    const entry = makeEntry({
      quantity: 1,
      rate: 21821.25,
      taxRate: 15,
      taxRateId: 5,
      isInclusiveTax: 1,
      sellAccountId: 1026,
    });
    const invoice = makeInvoice({
      balance: entry.amount, // 21,821.25 tax-inclusive
      taxAmountWithheld: entry.taxAmount, // 2,846.25
      isInclusiveTax: true,
      entries: [entry],
    });
    const entries = buildGL(invoice);

    expect(sumDebits(entries)).toBeCloseTo(sumCredits(entries), 2);
    expect(sumDebits(entries)).toBeCloseTo(21821.25, 2);
  });

  it('tax and income GL rows carry the tax rate id', () => {
    const entry = makeEntry({
      quantity: 165,
      rate: 115,
      taxRate: 15,
      taxRateId: 5,
      isInclusiveTax: 0,
      sellAccountId: 1026,
    });
    const invoice = makeInvoice({
      balance: entry.amount,
      taxAmountWithheld: entry.taxAmount,
      isInclusiveTax: false,
      entries: [entry],
    });
    const entries = buildGL(invoice);
    const taxEntry = entries.find((e) => e.accountId === 1013);
    const incomeEntry = entries.find((e) => e.accountId === 1026);

    expect(taxEntry.taxRateId).toBe(5);
    expect(incomeEntry.taxRateId).toBe(5);
    expect(taxEntry.credit).toBeCloseTo(2846.25, 2);
  });
});
