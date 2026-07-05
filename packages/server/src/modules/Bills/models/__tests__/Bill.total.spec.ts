import { Bill } from '../Bill';

const makeBill = (attrs: Partial<Bill>): Bill => {
  return Object.assign(new Bill(), {
    exchangeRate: 1,
    currencyCode: 'NZD',
    paymentAmount: 0,
    creditedAmount: 0,
    taxAmountWithheld: 0,
    discount: 0,
    adjustment: 0,
    ...attrs,
  });
};

describe('Bill total (tax handling)', () => {
  it('adds withheld tax to total when tax is EXCLUSIVE', () => {
    const bill = makeBill({
      amount: 1000, // subtotal excluding tax
      taxAmountWithheld: 150,
      isInclusiveTax: false,
    });
    expect(bill.total).toBeCloseTo(1150, 2);
    expect(bill.totalLocal).toBeCloseTo(1150, 2);
  });

  it('does NOT add withheld tax again when tax is INCLUSIVE', () => {
    const bill = makeBill({
      amount: 1150, // subtotal already including tax
      taxAmountWithheld: 150,
      isInclusiveTax: true,
    });
    expect(bill.total).toBeCloseTo(1150, 2);
    expect(bill.subtotalExcludingTax).toBeCloseTo(1000, 2);
  });

  it('keeps total = subtotal when there is no tax', () => {
    const bill = makeBill({ amount: 500, isInclusiveTax: false });
    expect(bill.total).toBeCloseTo(500, 2);
  });
});
