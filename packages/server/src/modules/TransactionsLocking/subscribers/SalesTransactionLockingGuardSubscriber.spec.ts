import { SalesTransactionLockingGuardSubscriber } from './SalesTransactionLockingGuardSubscriber';

describe('SalesTransactionLockingGuardSubscriber', () => {
  const buildSubscriber = () => {
    const salesLockingGuard = {
      transactionLockingGuard: jest.fn().mockResolvedValue(undefined),
    };
    const subscriber = new SalesTransactionLockingGuardSubscriber(
      salesLockingGuard as any,
    );
    return { subscriber, salesLockingGuard };
  };

  describe('invoice write-off', () => {
    it('checks the write-off date when writing off', async () => {
      const { subscriber, salesLockingGuard } = buildSubscriber();

      await subscriber.transactionLockinGuardOnInvoiceWritingoff({
        saleInvoice: { invoiceDate: '2023-01-01' },
        writeoffDate: '2023-03-15',
      } as any);

      expect(salesLockingGuard.transactionLockingGuard).toHaveBeenCalledWith(
        '2023-03-15',
      );
    });

    it('checks the removed entry date when cancelling an old write-off', async () => {
      const { subscriber, salesLockingGuard } = buildSubscriber();

      await subscriber.transactionLockinGuardOnInvoiceWritingoffCanceling({
        saleInvoice: { invoiceDate: '2023-01-01', writtenoffAt: '2026-11-05' },
        writeoffEntryDate: '2023-01-01',
      } as any);

      expect(salesLockingGuard.transactionLockingGuard).toHaveBeenCalledWith(
        '2023-01-01',
      );
    });

    it('checks the removed entry date when cancelling a write-off posted after the invoice date', async () => {
      const { subscriber, salesLockingGuard } = buildSubscriber();

      await subscriber.transactionLockinGuardOnInvoiceWritingoffCanceling({
        saleInvoice: { invoiceDate: '2023-01-01', writtenoffAt: '2026-11-05' },
        writeoffEntryDate: '2026-11-05',
      } as any);

      expect(salesLockingGuard.transactionLockingGuard).toHaveBeenCalledWith(
        '2026-11-05',
      );
    });
  });
});
