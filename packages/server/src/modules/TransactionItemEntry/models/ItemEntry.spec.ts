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
