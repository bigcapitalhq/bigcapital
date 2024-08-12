import { lowerCase } from 'lodash';
import UncategorizedCashflowTransaction from '@/models/UncategorizedCashflowTransaction';
import {
  BankRuleApplyIfTransactionType,
  BankRuleConditionComparator,
  BankRuleConditionType,
  IBankRule,
  IBankRuleCondition,
} from '../Rules/types';
import { BankRule } from '@/models/BankRule';

const conditionsMatch = (
  transaction: UncategorizedCashflowTransaction,
  conditions: IBankRuleCondition[],
  conditionsType: BankRuleConditionType = BankRuleConditionType.And
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
  transaction: UncategorizedCashflowTransaction,
  condition: IBankRuleCondition
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
  transaction: UncategorizedCashflowTransaction,
  condition: IBankRuleCondition
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
  transaction: UncategorizedCashflowTransaction
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

export const bankRulesMatchTransaction = (
  transaction: UncategorizedCashflowTransaction,
  bankRules: IBankRule[]
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
