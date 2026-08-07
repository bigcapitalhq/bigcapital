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
import { useCashFlowStatementContext } from './CashFlowStatementProvider';
import { dynamicColumns } from './dynamicColumns';
import type {
  CashflowStatementXlsxQuery,
  CashflowStatementCsvQuery,
} from '@bigcapital/sdk-ts';
import {
  AppToaster,
  Icon,
  If,
  Stack,
  FormattedMessage as T,
} from '@/components';
import {
  useCashFlowStatementCsvExport,
  useCashFlowStatementXlsxExport,
} from '@/hooks/query';

/**
 * Retrieve cash flow statement columns.
 */
export const useCashFlowStatementColumns = () => {
  const { cashFlowStatement } = useCashFlowStatementContext();

  return React.useMemo(
    () =>
      dynamicColumns(
        cashFlowStatement?.columns ?? [],
        cashFlowStatement?.tableRows ?? [],
      ),
    [cashFlowStatement],
  );
};

/**
 * Cash flow statement loading bar.
 */
export function CashFlowStatementLoadingBar() {
  const { isCashFlowFetching } = useCashFlowStatementContext();

  return (
    <If condition={isCashFlowFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Cash flow statement alter
 */
export function CashFlowStatementAlerts() {
  const { cashFlowStatement, isCashFlowLoading, refetchCashFlow } =
    useCashFlowStatementContext();

  // Handle refetch the report sheet.
  const handleRecalcReport = () => {
    refetchCashFlow();
  };
  // Can't display any error if the report is loading
  if (isCashFlowLoading) {
    return null;
  }
  // Can't continue if the cost compute is not running.
  if (!cashFlowStatement.meta.isCostComputeRunning) {
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
 * Cashflow sheet export menu.
 * @returns {JSX.Element}
 */
export function CashflowSheetExportMenu() {
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { httpQuery } = useCashFlowStatementContext();

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

  const { mutateAsync: xlsxExport } = useCashFlowStatementXlsxExport(
    httpQuery as CashflowStatementXlsxQuery,
  );
  const { mutateAsync: csvExport } = useCashFlowStatementCsvExport(
    httpQuery as CashflowStatementCsvQuery,
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
}
