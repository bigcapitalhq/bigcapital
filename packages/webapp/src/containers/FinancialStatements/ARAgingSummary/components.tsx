// @ts-nocheck
import React, { useRef } from 'react';
import classNames from 'classnames';
import {
  Classes,
  Intent,
  Menu,
  MenuItem,
  ProgressBar,
  Text,
} from '@blueprintjs/core';

import { useARAgingSummaryContext } from './ARAgingSummaryProvider';
import { AppToaster, If, Stack, FormattedMessage as T } from '@/components';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { agingSummaryDynamicColumns } from '../AgingSummary/dynamicColumns';
import {
  useARAgingSheetCsvExport,
  useARAgingSheetXlsxExport,
} from '@/hooks/query';

/**
 * Retrieve AR aging summary columns.
 */
export const useARAgingSummaryColumns = () => {
  const {
    ARAgingSummary: { table },
  } = useARAgingSummaryContext();

  return agingSummaryDynamicColumns(table.columns, table.rows);
};

/**
 * A/R aging summary sheet loading bar.
 */
export function ARAgingSummarySheetLoadingBar() {
  const { isARAgingFetching } = useARAgingSummaryContext();

  return (
    <If condition={isARAgingFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * A/R aging summary export menu.
 * @returns {JSX.Element}
 */
export function ARAgingSummaryExportMenu() {
  const toastKey = useRef(null);
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { httpQuery } = useARAgingSummaryContext();

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
  const { mutateAsync: xlsxExport } = useARAgingSheetXlsxExport(httpQuery, {
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
  const { mutateAsync: csvExport } = useARAgingSheetCsvExport(httpQuery, {
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
