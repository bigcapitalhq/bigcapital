import { calcBatchBalance, getBatchStatus } from './Batches.utils';
import { BatchStatus } from './types/Batches.types';

describe('Batches utils', () => {
  describe('calcBatchBalance', () => {
    it('falls back to the batch quantity when there are no IN transactions', () => {
      expect(calcBatchBalance(10, 0, 3)).toEqual({
        quantityIn: 10,
        quantityOut: 3,
        quantityOnHand: 7,
      });
    });

    it('uses the inventory transactions as the source of truth once they exist', () => {
      expect(calcBatchBalance(10, 12, 3)).toEqual({
        quantityIn: 12,
        quantityOut: 3,
        quantityOnHand: 9,
      });
    });
  });

  describe('getBatchStatus', () => {
    it('marks past expiry dates as expired', () => {
      expect(getBatchStatus('2020-01-01', 10)).toBe(BatchStatus.Expired);
    });

    it('marks batches without stock as depleted', () => {
      expect(getBatchStatus(null, 0)).toBe(BatchStatus.Depleted);
    });

    it('marks batches expiring within 30 days as expiring soon', () => {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 5);

      expect(getBatchStatus(expiryDate.toISOString(), 10)).toBe(
        BatchStatus.ExpiringSoon,
      );
    });

    it('marks far future expiry dates as active', () => {
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 2);

      expect(getBatchStatus(expiryDate.toISOString(), 10)).toBe(
        BatchStatus.Active,
      );
    });
  });
});
