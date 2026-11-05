import { SaleInvoiceWriteoffGLStorage } from './SaleInvoiceWriteoffGLStorage';

describe('SaleInvoiceWriteoffGLStorage', () => {
  describe('getWriteoffEntryDate', () => {
    const buildStorage = (storedEntry: { date: string } | undefined) => {
      const query = {
        modify: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(storedEntry),
      };
      const accountTransactionModel = () => ({ query: () => query });
      const storage = new SaleInvoiceWriteoffGLStorage(
        null as any,
        null as any,
        null as any,
        null as any,
        accountTransactionModel as any,
      );
      return { storage, query };
    };

    it('returns the stored entry date for an old write-off posted on the invoice date', async () => {
      const { storage, query } = buildStorage({ date: '2023-01-01' });

      await expect(
        storage.getWriteoffEntryDate({
          id: 1,
          invoiceDate: '2023-01-01',
          writtenoffAt: '2026-11-05',
        } as any),
      ).resolves.toBe('2023-01-01');

      expect(query.modify).toHaveBeenCalledWith(
        'filterByReference',
        1,
        'InvoiceWriteOff',
      );
    });

    it('falls back to the stored write-off date when no entry exists', async () => {
      const { storage } = buildStorage(undefined);

      await expect(
        storage.getWriteoffEntryDate({
          id: 1,
          invoiceDate: '2023-01-01',
          writtenoffAt: '2026-11-05',
        } as any),
      ).resolves.toBe('2026-11-05');
    });
  });
});
