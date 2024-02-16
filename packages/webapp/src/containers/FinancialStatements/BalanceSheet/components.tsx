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
  FormattedMessage as T,
  Icon,
  If,
  Stack,
  AppToaster,
} from '@/components';

import FinancialLoadingBar from '../FinancialLoadingBar';
import { useBalanceSheetContext } from './BalanceSheetProvider';
import { FinancialComputeAlert } from '../FinancialReportPage';
import { dynamicColumns } from './dynamicColumns';
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
  if (!balanceSheet.meta.is_cost_compute_running) {
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
  // Balance sheet context.
  const {
    balanceSheet: { table },
  } = useBalanceSheetContext();

  return React.useMemo(
    () => dynamicColumns(table.columns, table.rows),
    [table],
  );
};

/**
 * Retrieves the balance sheet export menu.
 * @returns {JSX.Element}
 */
export const BalanceSheetExportMenu = () => {
  const toastKey = useRef(null);
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { httpQuery } = useBalanceSheetContext();

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
  const { mutateAsync: xlsxExport } = useBalanceSheetXlsxExport(httpQuery, {
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

  // Export the report to csv.
  const { mutateAsync: csvExport } = useBalanceSheetCsvExport(httpQuery, {
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
    csvExport().then(() => {});
  };
  // Handle xlsx export button click.
  const handleXlsxExportBtnClick = () => {
    xlsxExport().then(() => {});
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
};
