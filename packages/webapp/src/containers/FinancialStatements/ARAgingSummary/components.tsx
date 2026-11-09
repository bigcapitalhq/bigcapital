import {
  Classes,
  Intent,
  Menu,
  MenuItem,
  ProgressBar,
  Text,
} from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { agingSummaryDynamicColumns } from '../AgingSummary/dynamicColumns';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import { useARAgingSummaryContext } from './ARAgingSummaryProvider';
import type {
  ReceivableAgingXlsxQuery,
  ReceivableAgingCsvQuery,
} from '@bigcapital/sdk-ts';
import { AppToaster, If, Stack } from '@/components';
import {
  useARAgingSheetCsvExport,
  useARAgingSheetXlsxExport,
} from '@/hooks/query';

export const useARAgingSummaryColumns = () => {
  const { ARAgingSummary } = useARAgingSummaryContext();

  return agingSummaryDynamicColumns(
    (ARAgingSummary as any)?.table?.columns ?? [],
    (ARAgingSummary as any)?.table?.rows ?? [],
  );
};

export function ARAgingSummarySheetLoadingBar() {
  const { isARAgingFetching } = useARAgingSummaryContext();

  return (
    <If condition={isARAgingFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

export function ARAgingSummaryExportMenu() {
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { httpQuery } = useARAgingSummaryContext();

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

  const { mutateAsync: xlsxExport } = useARAgingSheetXlsxExport(
    httpQuery as ReceivableAgingXlsxQuery,
  );
  const { mutateAsync: csvExport } = useARAgingSheetCsvExport(
    httpQuery as ReceivableAgingCsvQuery,
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
