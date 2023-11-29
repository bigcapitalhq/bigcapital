// @ts-nocheck
import { useRef } from 'react';
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
  If,
  Icon,
  FormattedMessage as T,
  Stack,
  AppToaster,
} from '@/components';
import { useTrialBalanceSheetContext } from './TrialBalanceProvider';
import { FinancialComputeAlert } from '../FinancialReportPage';
import FinancialLoadingBar from '../FinancialLoadingBar';
import {
  useTrialBalanceSheetCsvExport,
  useTrialBalanceSheetXlsxExport,
} from '@/hooks/query';
import { useTrialBalanceSheetHttpQuery } from './utils';

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

/**
 * Trial balance sheet export menu.
 */
export const TrialBalanceSheetExportMenu = () => {
  const toastKey = useRef(null);
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const httpQuery = useTrialBalanceSheetHttpQuery();

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
  const { mutateAsync: xlsxExport } = useTrialBalanceSheetXlsxExport(
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
  const { mutateAsync: csvExport } = useTrialBalanceSheetCsvExport(httpQuery, {
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
};
