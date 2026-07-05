import {
  computeWithholdingSettlement,
  computeNetOfWithholding,
} from '../withholding.utils';

describe('computeWithholdingSettlement', () => {
  // Datacom May 2026: 18,112.50 + 15% GST = 20,829.38; 20% WHT on labour
  // = 3,622.50; net banked = 17,206.88.
  const datacomMay = {
    total: 20829.38,
    subtotalExcludingTax: 18112.5,
    withholdingTaxRate: 20,
  };

  it('applies for a net-of-withholding settlement', () => {
    const result = computeWithholdingSettlement({
      ...datacomMay,
      paymentAmount: 17206.88,
    });
    expect(result.applies).toBe(true);
    expect(result.withheldAmount).toBeCloseTo(3622.5, 2);
  });

  it('books the exact residual so the invoice settles to zero', () => {
    const result = computeWithholdingSettlement({
      ...datacomMay,
      paymentAmount: 17206.9, // 2c rounding drift from the bank
    });
    expect(result.applies).toBe(true);
    expect(result.withheldAmount).toBeCloseTo(20829.38 - 17206.9, 2);
  });

  it('does not apply for a gross (full total) payment', () => {
    const result = computeWithholdingSettlement({
      ...datacomMay,
      paymentAmount: 20829.38,
    });
    expect(result.applies).toBe(false);
    expect(result.withheldAmount).toBe(0);
  });

  it('does not apply for an arbitrary partial payment', () => {
    const result = computeWithholdingSettlement({
      ...datacomMay,
      paymentAmount: 10000,
    });
    expect(result.applies).toBe(false);
  });

  it('does not apply when the customer has no withholding rate', () => {
    const result = computeWithholdingSettlement({
      ...datacomMay,
      withholdingTaxRate: 0,
      paymentAmount: 17206.88,
    });
    expect(result.applies).toBe(false);
  });
});

describe('computeNetOfWithholding', () => {
  it('returns total minus withholding on the tax-exclusive base', () => {
    expect(computeNetOfWithholding(20829.38, 18112.5, 20)).toBeCloseTo(
      17206.88,
      2,
    );
  });

  it('returns the total unchanged without a rate', () => {
    expect(computeNetOfWithholding(20829.38, 18112.5, 0)).toBe(20829.38);
  });
});
