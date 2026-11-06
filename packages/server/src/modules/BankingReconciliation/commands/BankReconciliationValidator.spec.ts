import { ServiceError } from '@/modules/Items/ServiceError';
import { BankReconciliationValidator } from './BankReconciliationValidator.service';

const buildQuery = (result: any) => {
  const promise = Promise.resolve(result);
  const chain: any = {
    where: jest.fn(() => chain),
    whereNot: jest.fn(() => chain),
    whereIn: jest.fn(() => chain),
    orderBy: jest.fn(() => chain),
    first: jest.fn(() => promise),
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
  };
  return chain;
};

describe('BankReconciliationValidator', () => {
  let reconciliationModel: jest.Mock;
  let reconciliationTransactionModel: jest.Mock;
  let validator: BankReconciliationValidator;

  beforeEach(() => {
    reconciliationModel = jest.fn();
    reconciliationTransactionModel = jest.fn();
    validator = new BankReconciliationValidator(
      reconciliationModel as any,
      reconciliationTransactionModel as any,
    );
  });

  it('rejects a period where start date is after end date', async () => {
    await expect(
      validator.validatePeriod({
        accountId: 1,
        startDate: '2026-11-30',
        endDate: '2026-11-01',
      }),
    ).rejects.toMatchObject({
      errorType: 'BANK_RECONCILIATION_PERIOD_INVALID',
    });
  });

  it('rejects an overlapping reconciliation period', async () => {
    const query = buildQuery({ id: 10 });
    reconciliationModel.mockReturnValue({ query: () => query });

    await expect(
      validator.validatePeriod({
        accountId: 1,
        startDate: '2026-11-01',
        endDate: '2026-11-30',
      }),
    ).rejects.toMatchObject({
      errorType: 'BANK_RECONCILIATION_PERIOD_OVERLAPS',
    });
  });

  it('requires the period to start the day after the previous reconciliation', async () => {
    const overlapQuery = buildQuery(undefined);
    const latestQuery = buildQuery({ id: 10, endDate: '2026-10-31' });
    reconciliationModel
      .mockReturnValueOnce({ query: () => overlapQuery })
      .mockReturnValueOnce({ query: () => latestQuery });

    await expect(
      validator.validatePeriod({
        accountId: 1,
        startDate: '2026-11-03',
        endDate: '2026-11-30',
      }),
    ).rejects.toMatchObject({
      errorType: 'BANK_RECONCILIATION_PERIOD_INVALID',
      payload: { requiredStartDate: '2026-11-01' },
    });
  });

  it('accepts a period starting the day after the previous reconciliation', async () => {
    const overlapQuery = buildQuery(undefined);
    const latestQuery = buildQuery({ id: 10, endDate: '2026-10-31' });
    reconciliationModel
      .mockReturnValueOnce({ query: () => overlapQuery })
      .mockReturnValueOnce({ query: () => latestQuery });

    await expect(
      validator.validatePeriod({
        accountId: 1,
        startDate: '2026-11-01',
        endDate: '2026-11-30',
      }),
    ).resolves.toBeUndefined();
  });

  it('rejects when another reconciliation is already in progress', async () => {
    const query = buildQuery({ id: 10 });
    reconciliationModel.mockReturnValue({ query: () => query });

    await expect(validator.validateNoInProgress(1)).rejects.toMatchObject({
      errorType: 'BANK_RECONCILIATION_ALREADY_IN_PROGRESS',
    });
  });

  it('rejects transactions that were already reconciled', async () => {
    const query = buildQuery([
      {
        referenceType: 'CashflowTransaction',
        referenceId: 10,
        transactionIndex: 1,
      },
    ]);
    reconciliationTransactionModel.mockReturnValue({ query: () => query });

    await expect(
      validator.validateTransactionsNotReconciled(1, [
        {
          referenceType: 'CashflowTransaction',
          referenceId: 10,
          index: 1,
        },
      ]),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it('accepts transactions that were not reconciled before', async () => {
    const query = buildQuery([]);
    reconciliationTransactionModel.mockReturnValue({ query: () => query });

    await expect(
      validator.validateTransactionsNotReconciled(1, [
        {
          referenceType: 'CashflowTransaction',
          referenceId: 10,
          index: 1,
        },
      ]),
    ).resolves.toBeUndefined();
  });
});
