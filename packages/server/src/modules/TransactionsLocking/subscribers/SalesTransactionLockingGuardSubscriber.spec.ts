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
  });
});
