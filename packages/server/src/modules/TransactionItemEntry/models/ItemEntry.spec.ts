import { DiscountType } from '@/common/types/Discount';
import { ItemEntry } from './ItemEntry';

describe('ItemEntry.calcAmount', () => {
  it('returns the gross amount when no discount is set', () => {
    expect(ItemEntry.calcAmount({ quantity: 2, rate: 1000 })).toBe(2000);
    expect(ItemEntry.calcAmount({ quantity: 2, rate: 1000, discount: 0 })).toBe(
      2000,
    );
  });

  it('applies a percentage discount', () => {
    expect(
      ItemEntry.calcAmount({
        quantity: 2,
        rate: 1000,
        discount: 10,
        discountType: DiscountType.Percentage,
      }),
    ).toBe(1800);
  });

  it('treats a missing discount type as percentage', () => {
    expect(
      ItemEntry.calcAmount({ quantity: 2, rate: 1000, discount: 10 }),
    ).toBe(1800);
  });

  it('applies an amount discount', () => {
    expect(
      ItemEntry.calcAmount({
        quantity: 2,
        rate: 1000,
        discount: 100,
        discountType: DiscountType.Amount,
      }),
    ).toBe(1900);
  });
});

describe('ItemEntry.taxAmount', () => {
  it('is zero when the entry has no tax rate', () => {
    const exclusive = ItemEntry.fromJson({ quantity: 1, rate: 1000 });
    const inclusive = ItemEntry.fromJson({
      quantity: 1,
      rate: 1000,
      isInclusiveTax: true,
    });

    expect(exclusive.taxAmount).toBe(0);
    expect(inclusive.taxAmount).toBe(0);
  });
});
