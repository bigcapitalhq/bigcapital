import { Ledger } from './Ledger';
import { LedgerStorageService } from './LedgerStorage.service';

describe('LedgerStorageService', () => {
  it('rejects deleting a journal entry that is part of a reconciliation', async () => {
    const accountTransactionModel = jest.fn(() => ({
      query: () => ({
        whereIn: () => ({
          select: jest.fn().mockResolvedValue([]),
        }),
      }),
    }));
    const reconciliationTransactionModel = jest.fn(() => ({
      query: () => ({
        whereIn: () => ({
          select: () => ({
            first: jest.fn().mockResolvedValue({ reconciliationId: 7 }),
          }),
        }),
      }),
    }));
    const ledgerEntriesService = { deleteEntries: jest.fn() };

    const service = new LedgerStorageService(
      {} as any,
      {} as any,
      ledgerEntriesService as any,
      accountTransactionModel as any,
      reconciliationTransactionModel as any,
      {} as any,
    );

    const ledger = new Ledger([{ entryId: 1001 } as any]);

    await expect(service.delete(ledger)).rejects.toMatchObject({
      errorType: 'BANK_RECONCILIATION_TRANSACTION_LOCKED',
      payload: { reconciliationId: 7 },
    });
    expect(ledgerEntriesService.deleteEntries).not.toHaveBeenCalled();
  });
});
