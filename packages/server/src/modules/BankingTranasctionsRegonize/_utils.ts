import { lowerCase } from 'lodash';
import { UncategorizedBankTransaction } from '../BankingTransactions/models/UncategorizedBankTransaction';
import {
  BankRuleApplyIfTransactionType,
  BankRuleConditionComparator,
  BankRuleConditionType,
} from '../BankRules/types';
import { BankRule } from '../BankRules/models/BankRule';
import { BankRuleCondition } from '../BankRules/models/BankRuleCondition';

const conditionsMatch = (
  transaction: UncategorizedBankTransaction,
  conditions: BankRuleCondition[],
  conditionsType: BankRuleConditionType = BankRuleConditionType.And,
) => {
  const method =
    conditionsType === BankRuleConditionType.And ? 'every' : 'some';

  return conditions[method]((condition) => {
    switch (determineFieldType(condition.field)) {
      case 'number':
        return matchNumberCondition(transaction, condition);
      case 'text':
        return matchTextCondition(transaction, condition);
      default:
        return false;
    }
  });
};

const matchNumberCondition = (
  transaction: UncategorizedBankTransaction,
  condition: BankRuleCondition,
) => {
  const conditionValue = parseFloat(condition.value);
  const transactionAmount =
    condition.field === 'amount'
      ? Math.abs(transaction[condition.field])
      : (transaction[condition.field] as unknown as number);

  switch (condition.comparator) {
    case BankRuleConditionComparator.Equals:
    case BankRuleConditionComparator.Equal:
      return transactionAmount === conditionValue;

    case BankRuleConditionComparator.BiggerOrEqual:
      return transactionAmount >= conditionValue;

    case BankRuleConditionComparator.Bigger:
      return transactionAmount > conditionValue;

    case BankRuleConditionComparator.Smaller:
      return transactionAmount < conditionValue;

    case BankRuleConditionComparator.SmallerOrEqual:
      return transactionAmount <= conditionValue;

    default:
      return false;
  }
};

const matchTextCondition = (
  transaction: UncategorizedBankTransaction,
  condition: BankRuleCondition,
): boolean => {
  const transactionValue = transaction[condition.field] as string;

  switch (condition.comparator) {
    case BankRuleConditionComparator.Equals:
    case BankRuleConditionComparator.Equal:
      return transactionValue === condition.value;
    case BankRuleConditionComparator.Contains:
      const fieldValue = lowerCase(transactionValue);
      const conditionValue = lowerCase(condition.value);

      return fieldValue.includes(conditionValue);
    case BankRuleConditionComparator.NotContain:
      return !transactionValue?.includes(condition.value.toString());
    default:
      return false;
  }
};

const matchTransactionType = (
  bankRule: BankRule,
  transaction: UncategorizedBankTransaction,
): boolean => {
  return (
    (transaction.isDepositTransaction &&
      bankRule.applyIfTransactionType ===
        BankRuleApplyIfTransactionType.Deposit) ||
    (transaction.isWithdrawalTransaction &&
      bankRule.applyIfTransactionType ===
        BankRuleApplyIfTransactionType.Withdrawal)
  );
};

/**
 * Retrieves the bank rules that apply to the given transaction account.
 * Bank rules without `applyIfAccountId` apply to all accounts.
 *
 * The `order` field determines the priority across both scopes (lower
 * values first) and account-specific rules win the tie on equal orders.
 * @param {BankRule[]} bankRules - All the bank rules.
 * @param {number} accountId - The transaction account id.
 * @returns {BankRule[]}
 */
export const getApplicableBankRules = (
  bankRules: BankRule[],
  accountId: number,
): BankRule[] => {
  const accountBankRules = bankRules.filter(
    (rule) =>
      rule.applyIfAccountId != null &&
      Number(rule.applyIfAccountId) === Number(accountId),
  );
  const allAccountsBankRules = bankRules.filter(
    (rule) => rule.applyIfAccountId == null,
  );
  // `Array#sort` is stable, so placing the account-specific rules first
  // keeps them ahead of the all-accounts rules on equal order values.
  return [...accountBankRules, ...allAccountsBankRules].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
};

export const bankRulesMatchTransaction = (
  transaction: UncategorizedBankTransaction,
  bankRules: BankRule[] = [],
) => {
  return bankRules.find((rule) => {
    return (
      matchTransactionType(rule, transaction) &&
      conditionsMatch(transaction, rule.conditions, rule.conditionsType)
    );
  });
};

const determineFieldType = (field: string): string => {
  switch (field) {
    case 'amount':
      return 'number';
    case 'description':
    case 'payee':
    default:
      return 'text';
  }
};
