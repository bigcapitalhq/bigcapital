import { ServiceError } from '@/modules/Items/ServiceError';
import { GetBudgetPrefill } from './GetBudgetPrefill.service';
import { ERRORS } from '../types/Budgets.types';

function createTransactionQueryMock(rows: unknown[]) {
  const query = {
    select: jest.fn().mockReturnThis(),
    sum: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    groupByRaw: jest.fn().mockResolvedValue(rows),
  };
  return query;
}

function createAccountQueryMock(accounts: unknown[]) {
  return {
    whereIn: jest.fn().mockResolvedValue(accounts),
  };
}

function createService(transactionRows: unknown[], accounts: unknown[]) {
  const transactionQuery = createTransactionQueryMock(transactionRows);
  const accountQuery = createAccountQueryMock(accounts);
  const transactionModel = jest.fn(() => ({ query: () => transactionQuery }));
  const accountModel = jest.fn(() => ({ query: () => accountQuery }));

  const service = new GetBudgetPrefill(
    transactionModel as never,
    accountModel as never,
  );
  return { service, transactionQuery, accountQuery };
}

describe('GetBudgetPrefill', () => {
  it('maps actuals to the matching target months and account normal', async () => {
    const { service } = createService(
      [
        { accountId: 1, month: '2023-01', credit: 100, debit: 0 },
        { accountId: 1, month: '2023-02', credit: 50, debit: 10 },
        { accountId: 2, month: '2023-01', credit: 0, debit: 200 },
      ],
      [
        { id: 1, accountNormal: 'credit' },
        { id: 2, accountNormal: 'debit' },
      ],
    );

    const result = await service.getBudgetPrefill({
      fromDate: '2024-01-01',
      toDate: '2024-02-29',
      sourceYear: 2023,
    });

    expect(result.sourceYear).toBe(2023);
    expect(result.fromDate).toBe('2024-01-01');
    expect(result.toDate).toBe('2024-02-29');
    expect(result.entries).toEqual([
      { accountId: 1, date: '2024-01-01', amount: 100 },
      { accountId: 2, date: '2024-01-01', amount: 200 },
      { accountId: 1, date: '2024-02-01', amount: 40 },
    ]);
  });

  it('skips months with a net negative actual', async () => {
    const { service } = createService(
      [{ accountId: 1, month: '2023-01', credit: 150, debit: 100 }],
      [{ id: 1, accountNormal: 'debit' }],
    );

    const result = await service.getBudgetPrefill({
      fromDate: '2024-01-01',
      toDate: '2024-01-31',
      sourceYear: 2023,
    });

    expect(result.entries).toEqual([]);
  });

  it('returns an empty entries list when there are no transactions', async () => {
    const { service } = createService([], []);

    const result = await service.getBudgetPrefill({
      fromDate: '2024-01-01',
      toDate: '2024-12-31',
      sourceYear: 2023,
    });

    expect(result.entries).toEqual([]);
  });

  it('rejects a source year that is not before the target year', async () => {
    const { service } = createService([], []);

    await expect(
      service.getBudgetPrefill({
        fromDate: '2024-01-01',
        toDate: '2024-12-31',
        sourceYear: 2024,
      }),
    ).rejects.toBeInstanceOf(ServiceError);

    try {
      await service.getBudgetPrefill({
        fromDate: '2024-01-01',
        toDate: '2024-12-31',
        sourceYear: 2024,
      });
    } catch (error) {
      expect((error as ServiceError).errorType).toBe(
        ERRORS.BUDGET_PREFILL_INVALID_SOURCE_YEAR,
      );
    }
  });
});
