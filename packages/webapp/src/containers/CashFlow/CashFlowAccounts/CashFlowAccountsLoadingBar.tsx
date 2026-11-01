import { useCashFlowAccountsContext } from './CashFlowAccountsProvider';
import { FinancialLoadingBar } from '@/containers/FinancialStatements/FinancialLoadingBar';

export function CashflowAccountsLoadingBar() {
  const { isCashFlowAccountsFetching } = useCashFlowAccountsContext();

  if (isCashFlowAccountsFetching) {
    return <FinancialLoadingBar />;
  }
  return null;
}
