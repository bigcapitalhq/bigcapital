import { AccountNormal } from '@/interfaces/Account';
import type { InventoryAdjustment } from '../../models/InventoryAdjustment';
import { InventoryAdjustmentsGL } from './InventoryAdjustmentGL';

describe('InventoryAdjustmentsGL', () => {
  it.each([
    [AccountNormal.CREDIT, 160],
    [AccountNormal.DEBIT, -160],
  ])(
    'signs the adjustment balance for a %s-normal account',
    (normal, expected) => {
      const inventoryAccountId = 1;
      const adjustmentAccountId = 2;
      const adjustment = {
        adjustmentAccountId,
        adjustmentAccount: { accountNormal: normal },
        entries: [{ cost: 160, quantity: 1, item: { inventoryAccountId } }],
      } as InventoryAdjustment;
      const ledger = new InventoryAdjustmentsGL(adjustment)
        .setBaseCurrency('USD')
        .getAdjustmentGL();

      const inventory = ledger.whereAccountId(inventoryAccountId);
      const offset = ledger.whereAccountId(adjustmentAccountId);

      expect(inventory.getClosingDebit()).toBe(160);
      expect(inventory.getClosingBalance()).toBe(160);
      expect(offset.getClosingCredit()).toBe(160);
      expect(offset.getClosingBalance()).toBe(expected);
    },
  );
});
