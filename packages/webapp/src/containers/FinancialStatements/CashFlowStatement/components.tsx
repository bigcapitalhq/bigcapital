// @ts-nocheck
import React, { useRef } from 'react';
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
import FinancialLoadingBar from '../FinancialLoadingBar';

import { dynamicColumns } from './dynamicColumns';
import { useCashFlowStatementContext } from './CashFlowStatementProvider';
import { FinancialComputeAlert } from '../FinancialReportPage';

/**
 * Retrieve cash flow statement columns.
 */
export const useCashFlowStatementColumns = () => {
  const {
    cashFlowStatement: { columns, tableRows },
  } = useCashFlowStatementContext();

  return React.useMemo(
    () => dynamicColumns(columns, tableRows),
    [columns, tableRows],
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
  if (!cashFlowStatement.meta.is_cost_compute_running) {
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
  const toastKey = useRef(null);
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { httpQuery } = useCashFlowStatementContext();

  const openProgressToast = (amount: number) => {
    return (
      <Stack spacing={8}>
        <Text>The report has been exported successfully.</Text>
        <ProgressBar
          className={classNames('toast-progress', {
            [Classes.PROGRESS_NO_STRIPES]: amount >= 100,
          })}
          intent={amount < 100 ? Intent.PRIMARY : Intent.SUCCESS}
          value={amount / 100}
        />
      </Stack>
    );
  };

  // Export the report to xlsx.
  const { mutateAsync: xlsxExport } = useCashFlowStatementXlsxExport(
    httpQuery,
    {
      onDownloadProgress: (xlsxExportProgress: number) => {
        if (!toastKey.current) {
          toastKey.current = AppToaster.show({
            message: openProgressToast(xlsxExportProgress),
            ...commonToastConfig,
          });
        } else {
          AppToaster.show(
            {
              message: openProgressToast(xlsxExportProgress),
              ...commonToastConfig,
            },
            toastKey.current,
          );
        }
      },
    },
  );

  // Export the report to csv.
  const { mutateAsync: csvExport } = useCashFlowStatementCsvExport(httpQuery, {
    onDownloadProgress: (xlsxExportProgress: number) => {
      if (!toastKey.current) {
        toastKey.current = AppToaster.show({
          message: openProgressToast(xlsxExportProgress),
          ...commonToastConfig,
        });
      } else {
        AppToaster.show(
          {
            message: openProgressToast(xlsxExportProgress),
            ...commonToastConfig,
          },
          toastKey.current,
        );
      }
    },
  });
  // Handle csv export button click.
  const handleCsvExportBtnClick = () => {
    csvExport();
  };
  // Handle xlsx export button click.
  const handleXlsxExportBtnClick = () => {
    xlsxExport();
  };

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
