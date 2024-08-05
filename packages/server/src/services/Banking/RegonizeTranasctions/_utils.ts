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
  switch (condition.comparator) {
    case BankRuleConditionComparator.Equals:
      return transaction[condition.field] === condition.value;
    case BankRuleConditionComparator.Contains:
      return transaction[condition.field]
        ?.toString()
        .includes(condition.value.toString());
    case BankRuleConditionComparator.NotContain:
      return !transaction[condition.field]
        ?.toString()
        .includes(condition.value.toString());
    default:
      return false;
  }
};

const matchTextCondition = (
  transaction: UncategorizedCashflowTransaction,
  condition: IBankRuleCondition
): boolean => {
  switch (condition.comparator) {
    case BankRuleConditionComparator.Equals:
      return transaction[condition.field] === condition.value;
    case BankRuleConditionComparator.Contains:
      const fieldValue = lowerCase(transaction[condition.field]);
      const conditionValue = lowerCase(condition.value);

      return fieldValue.includes(conditionValue);
    case BankRuleConditionComparator.NotContain:
      return !transaction[condition.field]?.includes(
        condition.value.toString()
      );
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
      return 'text';
    default:
      return 'unknown';
  }
};