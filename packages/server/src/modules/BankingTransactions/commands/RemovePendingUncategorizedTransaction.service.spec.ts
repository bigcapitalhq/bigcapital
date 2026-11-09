import { ServiceError } from '@/modules/Items/ServiceError';
import { RemovePendingUncategorizedTransaction } from './RemovePendingUncategorizedTransaction.service';

const buildService = (
  pendingTransactionOverrides: Record<string, any> = {},
) => {
  const operations: string[] = [];

  const recognizedDelete = jest.fn(() => {
    operations.push('delete-recognized');
    return Promise.resolve(1);
  });
  const pendingTransaction: any = {
    id: 114,
    isPending: true,
    recognizedTransactionId: null,
    $relatedQuery: jest.fn(() => ({ delete: recognizedDelete })),
    ...pendingTransactionOverrides,
  };

  const patch = jest.fn(() => {
    operations.push('unlink-recognized');
    return Promise.resolve(1);
  });
  const deleteUncategorized = jest.fn(() => {
    operations.push('delete-uncategorized');
    return Promise.resolve(1);
  });
  const findById = jest.fn(() => ({
    throwIfNotFound: jest.fn(() => Promise.resolve(pendingTransaction)),
    patch,
    delete: deleteUncategorized,
  }));
  const uncategorizedBankTransaction = jest.fn(() => ({
    query: jest.fn(() => ({ findById })),
  }));
  const eventPublisher = { emitAsync: jest.fn(() => Promise.resolve()) };
  const uow = {
    withTransaction: jest.fn((work: any, trx: any) =>
      work(trx ?? { id: 'generated-trx' }),
    ),
  };
  const service = new RemovePendingUncategorizedTransaction(
    eventPublisher as any,
    uow as any,
    uncategorizedBankTransaction as any,
  );

  return {
    service,
    operations,
    pendingTransaction,
    patch,
    deleteUncategorized,
    eventPublisher,
    uow,
  };
};

describe('RemovePendingUncategorizedTransaction', () => {
  it('unlinks and deletes the recognized transaction before deleting the pending one', async () => {
    const { service, operations, pendingTransaction, patch, uow } =
      buildService({ recognizedTransactionId: 55 });
    const trx = { id: 'outer-trx' } as any;

    await service.removePendingTransaction(114, trx);

    expect(patch).toHaveBeenCalledWith({ recognizedTransactionId: null });
    expect(pendingTransaction.$relatedQuery).toHaveBeenCalledWith(
      'recognizedTransaction',
      trx,
    );
    expect(operations).toEqual([
      'unlink-recognized',
      'delete-recognized',
      'delete-uncategorized',
    ]);
    expect(uow.withTransaction).toHaveBeenCalledWith(expect.any(Function), trx);
  });

  it('deletes the pending transaction without touching recognition when not recognized', async () => {
    const { service, operations, pendingTransaction, patch } = buildService();

    await service.removePendingTransaction(114);

    expect(patch).not.toHaveBeenCalled();
    expect(pendingTransaction.$relatedQuery).not.toHaveBeenCalled();
    expect(operations).toEqual(['delete-uncategorized']);
  });

  it('throws and does not delete when the transaction is not pending', async () => {
    const { service, deleteUncategorized, uow } = buildService({
      isPending: false,
    });

    await expect(service.removePendingTransaction(114)).rejects.toBeInstanceOf(
      ServiceError,
    );
    expect(deleteUncategorized).not.toHaveBeenCalled();
    expect(uow.withTransaction).not.toHaveBeenCalled();
  });
});
