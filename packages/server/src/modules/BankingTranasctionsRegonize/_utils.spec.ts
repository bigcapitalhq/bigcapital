import { bankRulesMatchTransaction, getApplicableBankRules } from './_utils';
import type { BankRule } from '../BankRules/models/BankRule';
import type { UncategorizedBankTransaction } from '../BankingTransactions/models/UncategorizedBankTransaction';

const buildRule = (overrides: Record<string, any> = {}): BankRule =>
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
    assignAccountId: 1,
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

describe('getApplicableBankRules', () => {
  it('returns the all-accounts rules when the account has no specific rule', () => {
    const globalRule = buildRule({ id: 1, applyIfAccountId: null });
    const otherAccountRule = buildRule({ id: 2, applyIfAccountId: 999 });

    const result = getApplicableBankRules([globalRule, otherAccountRule], 100);

    expect(result).toEqual([globalRule]);
  });

  it('orders the rules by `order` across the account and all-accounts scopes', () => {
    const accountRule = buildRule({ id: 1, applyIfAccountId: 100, order: 2 });
    const globalRule = buildRule({ id: 2, applyIfAccountId: null, order: 1 });

    const result = getApplicableBankRules([accountRule, globalRule], 100);

    expect(result.map((rule) => rule.id)).toEqual([2, 1]);
  });

  it('prefers the account-specific rule on equal orders', () => {
    const globalRule = buildRule({ id: 1, applyIfAccountId: null, order: 0 });
    const accountRule = buildRule({ id: 2, applyIfAccountId: 100, order: 0 });

    const result = getApplicableBankRules([globalRule, accountRule], 100);

    expect(result.map((rule) => rule.id)).toEqual([2, 1]);
  });

  it('returns an empty array when no rule applies', () => {
    const result = getApplicableBankRules(
      [buildRule({ id: 1, applyIfAccountId: 999 })],
      100,
    );

    expect(result).toEqual([]);
  });
});

describe('bankRulesMatchTransaction', () => {
  it('returns the first rule that matches the transaction', () => {
    const firstRule = buildRule({ id: 1 });
    const secondRule = buildRule({ id: 2 });

    const result = bankRulesMatchTransaction(buildTransaction(), [
      firstRule,
      secondRule,
    ]);

    expect(result).toBe(firstRule);
  });

  it('does not throw when the bank rules are undefined', () => {
    const result = bankRulesMatchTransaction(
      buildTransaction(),
      undefined as unknown as BankRule[],
    );

    expect(result).toBeUndefined();
  });

  it('returns undefined when no rule matches the conditions', () => {
    const rule = buildRule({
      conditions: [
        { field: 'description', comparator: 'contains', value: 'rent' },
      ],
    });

    const result = bankRulesMatchTransaction(buildTransaction(), [rule]);

    expect(result).toBeUndefined();
  });

  it('skips the rules that do not match the transaction type', () => {
    const withdrawalRule = buildRule({
      id: 1,
      applyIfTransactionType: 'withdrawal',
    });
    const depositRule = buildRule({ id: 2, applyIfTransactionType: 'deposit' });

    const result = bankRulesMatchTransaction(buildTransaction(), [
      withdrawalRule,
      depositRule,
    ]);

    expect(result).toBe(depositRule);
  });
});
