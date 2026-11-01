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
import React from 'react';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import { FinancialComputeAlert } from '../FinancialReportPage';
import { useBalanceSheetContext } from './BalanceSheetProvider';
import { dynamicColumns } from './dynamicColumns';
import type {
  BalanceSheetXlsxQuery,
  BalanceSheetCsvQuery,
} from '@bigcapital/sdk-ts';
import {
  FormattedMessage as T,
  Icon,
  If,
  Stack,
  AppToaster,
} from '@/components';
import {
  useBalanceSheetCsvExport,
  useBalanceSheetXlsxExport,
} from '@/hooks/query';

/**
 * Balance sheet alerts.
 */
export function BalanceSheetAlerts() {
  const { isLoading, refetchBalanceSheet, balanceSheet } =
    useBalanceSheetContext();

  // Handle refetch the report sheet.
  const handleRecalcReport = () => {
    refetchBalanceSheet();
  };
  // Can't display any error if the report is loading.
  if (isLoading) {
    return null;
  }
  // Can't continue if the cost compute job is not running.
  if (!balanceSheet?.meta?.isCostComputeRunning) {
    return null;
  }
  return (
    <FinancialComputeAlert>
      <Icon icon="info-block" iconSize={12} />{' '}
      <T id={'just_a_moment_we_re_calculating_your_cost_transactions'} />
      <Button onClick={handleRecalcReport} minimal={true} small={true}>
        <T id={'report.compute_running.refresh'} />
      </Button>
    </FinancialComputeAlert>
  );
}

/**
 * Balance sheet loading bar.
 */
export function BalanceSheetLoadingBar() {
  const { isFetching } = useBalanceSheetContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Retrieve balance sheet columns.
 */
export const useBalanceSheetColumns = () => {
  const { balanceSheet } = useBalanceSheetContext();

  return React.useMemo(
    () =>
      dynamicColumns(
        balanceSheet?.table?.columns ?? [],
        balanceSheet?.table?.rows ?? [],
      ),
    [balanceSheet?.table],
  );
};

/**
 * Retrieves the balance sheet export menu.
 * @returns {JSX.Element}
 */
export const BalanceSheetExportMenu = () => {
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { httpQuery } = useBalanceSheetContext();

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

  const { mutateAsync: xlsxExport } = useBalanceSheetXlsxExport(
    httpQuery as BalanceSheetXlsxQuery,
  );
  const { mutateAsync: csvExport } = useBalanceSheetCsvExport(
    httpQuery as BalanceSheetCsvQuery,
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
