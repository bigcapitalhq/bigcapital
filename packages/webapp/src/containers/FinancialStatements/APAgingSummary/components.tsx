import {
  Classes,
  Intent,
  Menu,
  MenuItem,
  ProgressBar,
  Text,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { agingSummaryDynamicColumns } from '../AgingSummary/dynamicColumns';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import { useAPAgingSummaryContext } from './APAgingSummaryProvider';
import type {
  PayableAgingXlsxQuery,
  PayableAgingCsvQuery,
} from '@bigcapital/sdk-ts';
import { AppToaster, If, Stack } from '@/components';
import {
  useAPAgingSheetCsvExport,
  useAPAgingSheetXlsxExport,
} from '@/hooks/query';

export const useAPAgingSummaryColumns = () => {
  const { APAgingSummary } = useAPAgingSummaryContext();

  return agingSummaryDynamicColumns(
    (APAgingSummary as any)?.table?.columns ?? [],
    (APAgingSummary as any)?.table?.rows ?? [],
  );
};

export function APAgingSummarySheetLoadingBar() {
  const { isAPAgingFetching } = useAPAgingSummaryContext();

  return (
    <If condition={isAPAgingFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

export function APAgingSummaryExportMenu() {
  const commonToastConfig = { isCloseButtonShown: true, timeout: 2000 };
  const { httpQuery } = useAPAgingSummaryContext();

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

  const { mutateAsync: xlsxExport } = useAPAgingSheetXlsxExport(
    httpQuery as PayableAgingXlsxQuery,
  );
  const { mutateAsync: csvExport } = useAPAgingSheetCsvExport(
    httpQuery as PayableAgingCsvQuery,
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
