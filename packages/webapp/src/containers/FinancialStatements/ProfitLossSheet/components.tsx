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
import { useProfitLossSheetContext } from './ProfitLossProvider';
import type {
  ProfitLossXlsxQuery,
  ProfitLossCsvQuery,
} from '@bigcapital/sdk-ts';
import {
  AppToaster,
  Icon,
  If,
  Stack,
  FormattedMessage as T,
} from '@/components';
import {
  useProfitLossSheetCsvExport,
  useProfitLossSheetXlsxExport,
} from '@/hooks/query';

/**
 * Profit/loss sheet loading bar.
 */
export function ProfitLossSheetLoadingBar() {
  const { isFetching } = useProfitLossSheetContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Balance sheet alerts.
 */
export function ProfitLossSheetAlerts() {
  const { isLoading, sheetRefetch, profitLossSheet } =
    useProfitLossSheetContext();

  // Handle refetch the report sheet.
  const handleRecalcReport = () => {
    sheetRefetch();
  };
  // Can't display any error if the report is loading.
  if (isLoading) {
    return null;
  }
  // Can't continue if the cost compute job is not running.
  if (!profitLossSheet?.meta?.isCostComputeRunning) {
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
 * Profit/loss sheet export menu.
 */
export const ProfitLossSheetExportMenu = () => {
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { httpQuery } = useProfitLossSheetContext();

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

  const { mutateAsync: xlsxExport } = useProfitLossSheetXlsxExport(
    httpQuery as ProfitLossXlsxQuery,
  );
  const { mutateAsync: csvExport } = useProfitLossSheetCsvExport(
    httpQuery as ProfitLossCsvQuery,
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
