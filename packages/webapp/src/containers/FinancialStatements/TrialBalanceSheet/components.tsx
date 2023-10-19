// @ts-nocheck
import { Button } from '@blueprintjs/core';
import { If, Icon, FormattedMessage as T } from '@/components';
import { useTrialBalanceSheetContext } from './TrialBalanceProvider';
import { FinancialComputeAlert } from '../FinancialReportPage';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Trial balance sheet progress loading bar.
 */
export function TrialBalanceSheetLoadingBar() {
  const { isFetching } = useTrialBalanceSheetContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Trial balance sheet alerts.
 */
export function TrialBalanceSheetAlerts() {
  const {
    trialBalanceSheet,
    isLoading,
    refetchSheet,
  } = useTrialBalanceSheetContext();

  // Handle refetch the sheet.
  const handleRecalcReport = () => {
    refetchSheet();
  };
  // Can't display any error if the report is loading.
  if (isLoading) {
    return null;
  }
  // Can't continue if the cost compute job is not running.
  if (!trialBalanceSheet?.meta.is_cost_compute_running) {
    return null;
  }

  return (
    <FinancialComputeAlert>
      <Icon icon="info-block" iconSize={12} />
      <T id={'just_a_moment_we_re_calculating_your_cost_transactions'} />

      <Button onClick={handleRecalcReport} minimal={true} small={true}>
        <T id={'refresh'} />
      </Button>
    </FinancialComputeAlert>
  );
}
