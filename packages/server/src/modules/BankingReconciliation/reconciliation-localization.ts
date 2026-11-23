import { I18nContext, I18nService } from 'nestjs-i18n';
import { getTransactionTypeLabel } from '../BankingTransactions/utils';

export function getReconciliationDateLocale(): string {
  return I18nContext.current()?.lang === 'ar' ? 'ar-ly' : 'en';
}

export function getReconciliationTransactionTypeLabel(
  i18n: I18nService,
  referenceType: string,
  transactionType: string | null,
): string {
  const key = getTransactionTypeLabel(referenceType, transactionType);
  return i18n.t(key || 'reconciliation_status.unknown_type');
}
