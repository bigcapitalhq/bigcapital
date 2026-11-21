import { ERRORS } from '../constants';
import { IBankReconciliationTransactionKey } from '../types/BankingReconciliation.types';
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
  const setup = (
    draftTransactions: IBankReconciliationTransactionKey[] | null = null,
  ) => {
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
      draftTransactions,
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

    return { service, query };
  };

  it('records the reconciled journal entries in one batch insert', async () => {
    const { service, query } = setup();
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

  const deposit = {
    referenceType: 'CashflowTransaction',
    referenceId: 11,
    index: 0,
  };

  it.each(['request', 'draft'])(
    'checks the balance with a repeated %s selection counted once',
    async (source) => {
      const selections = [deposit, { ...deposit }];
      const { service, query } = setup(source === 'draft' ? selections : null);
      const result = service.finishBankReconciliation(1, {
        endingBalance: 140,
        transactions: source === 'request' ? selections : undefined,
      });

      await expect(result).rejects.toMatchObject({
        errorType: ERRORS.BANK_RECONCILIATION_DIFFERENCE_NOT_ZERO,
        payload: { difference: 20, clearedBalance: 120, endingBalance: 140 },
      });
      expect(query.delete).not.toHaveBeenCalled();
      expect(query.insert).not.toHaveBeenCalled();
      expect(query.patchAndFetchById).not.toHaveBeenCalled();
    },
  );

  it('finishes with one link when the repeated selection balances the statement', async () => {
    const { service, query } = setup();
    await service.finishBankReconciliation(1, {
      endingBalance: 120,
      transactions: [
        deposit,
        {
          referenceType: deposit.referenceType,
          referenceId: deposit.referenceId,
        },
      ],
    });

    expect(query.insert).toHaveBeenCalledWith([
      expect.objectContaining({ accountTransactionId: 1002 }),
    ]);
    expect(query.patchAndFetchById).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        clearedBalance: 120,
        difference: 0,
      }),
    );
  });
});
