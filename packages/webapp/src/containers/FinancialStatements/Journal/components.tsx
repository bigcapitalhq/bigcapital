// @ts-nocheck
import React, { useRef } from 'react';
import classNames from 'classnames';
import {
  Button,
  Classes,
  Menu,
  MenuItem,
  ProgressBar,
  Text,
  Intent,
} from '@blueprintjs/core';

import {
  AppToaster,
  Icon,
  If,
  Stack,
  FormattedMessage as T,
} from '@/components';
import { useJournalSheetContext } from './JournalProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { FinancialComputeAlert } from '../FinancialReportPage';

import {
  useJournalSheetCsvExport,
  useJournalSheetXlsxExport,
} from '@/hooks/query';

/**
 * Journal sheet loading bar.
 */
export function JournalSheetLoadingBar() {
  const { isFetching } = useJournalSheetContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Journal sheet alerts.
 */
export function JournalSheetAlerts() {
  const { isLoading, refetchSheet, journalSheet } = useJournalSheetContext();

  // Handle refetch the report sheet.
  const handleRecalcReport = () => {
    refetchSheet();
  };
  // Can't display any error if the report is loading.
  if (isLoading) {
    return null;
  }
  // Can't continue if the cost compute job is running.
  if (!journalSheet.meta.is_cost_compute_running) {
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
 * Retrieves the journal sheet export menu.
 * @returns {JSX.Element}
 */
export const JournalSheetExportMenu = () => {
  const toastKey = useRef(null);
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { httpQuery } = useJournalSheetContext();

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
  // Exports the report to xlsx.
  const { mutateAsync: xlsxExport } = useJournalSheetXlsxExport(httpQuery, {
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
  // Exports the report to csv.
  const { mutateAsync: csvExport } = useJournalSheetCsvExport(httpQuery, {
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
