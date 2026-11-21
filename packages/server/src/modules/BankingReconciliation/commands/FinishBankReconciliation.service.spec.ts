import { FinishBankReconciliationService } from './FinishBankReconciliation.service';

const buildQuery = () => {
  const query: any = {
    where: jest.fn(() => query),
    delete: jest.fn().mockResolvedValue(1),
    insert: jest.fn().mockResolvedValue([1, 2]),
    patchAndFetchById: jest.fn().mockResolvedValue({ id: 1 }),
  };
  return query;
};

describe('FinishBankReconciliationService', () => {
  it('records the reconciled journal entries in one batch insert', async () => {
    const trx = {} as any;
    const query = buildQuery();
    const reconciliationTransactionModel = jest.fn(() => ({
      query: () => query,
    }));
    const reconciliationModel = jest.fn(() => ({
      query: () => query,
    }));

    const reconciliation = {
      id: 1,
      accountId: 5,
      startDate: '2026-11-01',
      endDate: '2026-11-30',
      beginningBalance: 100,
      endingBalance: 130,
      status: 'in_progress',
      isInProgress: true,
      notes: null,
      draftTransactions: null,
    };

    const rows = [
      {
        key: 'CashflowTransaction:10:0',
        accountTransactionId: 1001,
        referenceType: 'CashflowTransaction',
        referenceId: 10,
        index: 0,
        date: '2026-11-05',
        debit: 10,
        credit: 0,
      },
      {
        key: 'CashflowTransaction:11:0',
        accountTransactionId: 1002,
        referenceType: 'CashflowTransaction',
        referenceId: 11,
        index: 0,
        date: '2026-11-06',
        debit: 20,
        credit: 0,
      },
    ];

    const repository = {
      getReconciliationOrThrow: jest.fn().mockResolvedValue(reconciliation),
      getFirstStartDate: jest.fn().mockResolvedValue('2026-11-01'),
      getUnreconciledTransactions: jest.fn().mockResolvedValue({ rows }),
      buildTransactionKey: jest.fn(
        (referenceType, referenceId, index) =>
          `${referenceType}:${referenceId}:${Number(index ?? 0)}`,
      ),
    };

    const service = new FinishBankReconciliationService(
      reconciliationModel as any,
      reconciliationTransactionModel as any,
      repository as any,
      { validateTransactionsNotReconciled: jest.fn() } as any,
      { withTransaction: (work) => work(trx) } as any,
      { emitAsync: jest.fn().mockResolvedValue(undefined) } as any,
      { get: jest.fn().mockReturnValue(1) } as any,
    );

    await service.finishBankReconciliation(1, {
      endingBalance: 130,
      transactions: [
        {
          referenceType: 'CashflowTransaction',
          referenceId: 10,
          index: 0,
        },
        {
          referenceType: 'CashflowTransaction',
          referenceId: 11,
          index: 0,
        },
      ],
    } as any);

    expect(query.insert).toHaveBeenCalledTimes(1);
    expect(query.insert).toHaveBeenCalledWith([
      {
        reconciliationId: 1,
        accountId: 5,
        accountTransactionId: 1001,
        referenceType: 'CashflowTransaction',
        referenceId: 10,
        transactionIndex: 0,
      },
      {
        reconciliationId: 1,
        accountId: 5,
        accountTransactionId: 1002,
        referenceType: 'CashflowTransaction',
        referenceId: 11,
        transactionIndex: 0,
      },
    ]);
  });
});
