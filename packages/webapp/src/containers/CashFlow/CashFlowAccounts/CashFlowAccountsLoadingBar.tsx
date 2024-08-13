// @ts-nocheck
import FinancialLoadingBar from '@/containers/FinancialStatements/FinancialLoadingBar';
import { useCashFlowAccountsContext } from './CashFlowAccountsProvider';

export function CashflowAccountsLoadingBar() {
  const { isCashFlowAccountsFetching } = useCashFlowAccountsContext();

  if (isCashFlowAccountsFetching) {
    return <FinancialLoadingBar />;
  }
  return null;
}
