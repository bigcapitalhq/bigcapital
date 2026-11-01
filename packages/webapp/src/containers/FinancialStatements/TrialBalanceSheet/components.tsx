import {
  Button,
  Classes,
  Intent,
  Menu,
  MenuItem,
  ProgressBar,
  Text,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import { FinancialComputeAlert } from '../FinancialReportPage';
import { useTrialBalanceSheetContext } from './TrialBalanceProvider';
import { useTrialBalanceSheetHttpQuery } from './utils';
import type {
  TrialBalanceXlsxQuery,
  TrialBalanceCsvQuery,
} from '@bigcapital/sdk-ts';
import {
  If,
  Icon,
  FormattedMessage as T,
  Stack,
  AppToaster,
} from '@/components';
import {
  useTrialBalanceSheetCsvExport,
  useTrialBalanceSheetXlsxExport,
} from '@/hooks/query';

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
  const { trialBalanceSheet, isLoading, refetchSheet } =
    useTrialBalanceSheetContext();

  // Handle refetch the sheet.
  const handleRecalcReport = () => {
    refetchSheet();
  };
  // Can't display any error if the report is loading.
  if (isLoading) {
    return null;
  }
  // Can't continue if the cost compute job is not running.
  if (!(trialBalanceSheet as any)?.meta?.isCostComputeRunning) {
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

/**
 * Trial balance sheet export menu.
 */
export const TrialBalanceSheetExportMenu = () => {
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const httpQuery = useTrialBalanceSheetHttpQuery();

  const renderToast = (done: boolean) => {
    return (
      <Stack spacing={8}>
        <Text>
          {done
            ? 'The report has been exported successfully.'
            : 'Exporting the report…'}
        </Text>
        <ProgressBar
          className={classNames('toast-progress', {
            [Classes.PROGRESS_NO_STRIPES]: done,
          })}
          intent={done ? Intent.SUCCESS : Intent.PRIMARY}
          value={done ? 1 : undefined}
        />
      </Stack>
    );
  };

  const { mutateAsync: xlsxExport } = useTrialBalanceSheetXlsxExport(
    httpQuery as TrialBalanceXlsxQuery,
  );
  const { mutateAsync: csvExport } = useTrialBalanceSheetCsvExport(
    httpQuery as TrialBalanceCsvQuery,
  );

  const runExport = async (mutate: () => Promise<unknown>) => {
    const key = AppToaster.show({
      message: renderToast(false),
      ...commonToastConfig,
      timeout: 0,
    });
    try {
      await mutate();
      AppToaster.show(
        { message: renderToast(true), ...commonToastConfig },
        key,
      );
    } catch {
      AppToaster.dismiss(key);
    }
  };

  const handleCsvExportBtnClick = () => runExport(csvExport);
  const handleXlsxExportBtnClick = () => runExport(xlsxExport);

  return (
    <Menu>
      <MenuItem
        text={'XLSX (Microsoft Excel)'}
        onClick={handleXlsxExportBtnClick}
      />
      <MenuItem text={'CSV'} onClick={handleCsvExportBtnClick} />
    </Menu>
  );
};
