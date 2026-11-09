import { events } from '@/common/events/events';
import { RecognizeTranasctionsService } from './RecognizeTranasctions.service';
import type { BankRule } from '../../BankRules/models/BankRule';
import type { UncategorizedBankTransaction } from '../../BankingTransactions/models/UncategorizedBankTransaction';

const buildRule = (overrides: Partial<BankRule> = {}): BankRule =>
  ({
    id: 1,
    name: 'Rule',
    order: 0,
    applyIfAccountId: null,
    applyIfTransactionType: 'deposit',
    conditionsType: 'and',
    conditions: [
      { field: 'description', comparator: 'contains', value: 'salary' },
    ],
    assignCategory: 'Deposit',
    assignAccountId: 5,
    ...overrides,
  }) as unknown as BankRule;

const buildTransaction = (
  overrides: Partial<UncategorizedBankTransaction> = {},
): UncategorizedBankTransaction =>
  ({
    id: 1,
    accountId: 100,
    description: 'Monthly salary payment',
    isDepositTransaction: true,
    isWithdrawalTransaction: false,
    ...overrides,
  }) as unknown as UncategorizedBankTransaction;

const createQueryMock = (resolveWith: any) => {
  const query: any = {};
  query.modify = jest.fn(() => query);
  query.where = jest.fn(() => query);
  query.whereIn = jest.fn(() => query);
  query.withGraphFetched = jest.fn(() => query);
  query.orderBy = jest.fn(() => query);

  const patch = jest.fn(() => Promise.resolve(1));
  query.patch = patch;
  query.findById = jest.fn(() => ({ patch }));
  query.onBuild = jest.fn((callback: (q: any) => void) => {
    callback(query);
    return Promise.resolve(resolveWith);
  });
  return query;
};

const createService = (
  options: {
    transactions?: UncategorizedBankTransaction[];
    bankRules?: BankRule[];
    insertError?: Error;
  } = {},
) => {
  const uncategorizedQuery = createQueryMock(options.transactions ?? []);
  const bankRulesQuery = createQueryMock(options.bankRules ?? []);

  const insert = jest.fn((data: any) =>
    options.insertError
      ? Promise.reject(options.insertError)
      : Promise.resolve({ id: 100, ...data }),
  );
  const recognizedQuery = { insert };
  const eventPublisher = { emitAsync: jest.fn(() => Promise.resolve()) };

  const service = new RecognizeTranasctionsService(
    eventPublisher as any,
    (() => ({ query: jest.fn(() => uncategorizedQuery) })) as any,
    (() => ({ query: jest.fn(() => recognizedQuery) })) as any,
    (() => ({ query: jest.fn(() => bankRulesQuery) })) as any,
  );

  return {
    service,
    eventPublisher,
    insert,
    uncategorizedQuery,
    bankRulesQuery,
  };
};

describe('RecognizeTranasctionsService', () => {
  it('recognizes a transaction with an all-accounts rule when the account has no specific rule', async () => {
    const transaction = buildTransaction({ id: 10, accountId: 200 });
    const globalRule = buildRule({ id: 7, applyIfAccountId: null });
    const { service, insert, eventPublisher } = createService({
      transactions: [transaction],
      bankRules: [globalRule],
    });

    await service.recognizeTransactions();

    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        bankRuleId: 7,
        uncategorizedTransactionId: 10,
        assignedCategory: 'Deposit',
        assignedAccountId: 5,
      }),
    );
    expect(eventPublisher.emitAsync).toHaveBeenCalledWith(
      events.bankRecognize.onRecognized,
      expect.objectContaining({
        uncategorizedTransactionIds: [10],
        recognizedCount: 1,
      }),
    );
  });

  it('recognizes a transaction with an account-specific rule', async () => {
    const transaction = buildTransaction({ id: 11, accountId: 300 });
    const accountRule = buildRule({ id: 3, applyIfAccountId: 300 });
    const otherAccountRule = buildRule({ id: 4, applyIfAccountId: 400 });
    const { service, insert } = createService({
      transactions: [transaction],
      bankRules: [accountRule, otherAccountRule],
    });

    await service.recognizeTransactions();

    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        bankRuleId: 3,
        uncategorizedTransactionId: 11,
      }),
    );
  });

  it('prefers the matching rule with the lowest order across both scopes', async () => {
    const transaction = buildTransaction({ id: 12, accountId: 300 });
    const accountRule = buildRule({ id: 3, applyIfAccountId: 300, order: 5 });
    const globalRule = buildRule({ id: 4, applyIfAccountId: null, order: 1 });
    const { service, insert } = createService({
      transactions: [transaction],
      bankRules: [accountRule, globalRule],
    });

    await service.recognizeTransactions();

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ bankRuleId: 4 }),
    );
  });

  it('prefers the account-specific rule on equal orders', async () => {
    const transaction = buildTransaction({ id: 13, accountId: 300 });
    const accountRule = buildRule({ id: 3, applyIfAccountId: 300, order: 0 });
    const globalRule = buildRule({ id: 4, applyIfAccountId: null, order: 0 });
    const { service, insert } = createService({
      transactions: [transaction],
      bankRules: [globalRule, accountRule],
    });

    await service.recognizeTransactions();

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ bankRuleId: 3 }),
    );
  });

  it('does not recognize the transaction when no rule applies', async () => {
    const transaction = buildTransaction({ id: 14, accountId: 200 });
    const otherAccountRule = buildRule({ id: 3, applyIfAccountId: 300 });
    const { service, insert, eventPublisher } = createService({
      transactions: [transaction],
      bankRules: [otherAccountRule],
    });

    await service.recognizeTransactions();

    expect(insert).not.toHaveBeenCalled();
    expect(eventPublisher.emitAsync).not.toHaveBeenCalled();
  });

  it('throws the first promise pool error instead of swallowing it', async () => {
    const insertError = new Error('Insert failed');
    const { service } = createService({
      transactions: [buildTransaction()],
      bankRules: [buildRule()],
      insertError,
    });

    await expect(service.recognizeTransactions()).rejects.toThrow(
      insertError.message,
    );
  });
});
