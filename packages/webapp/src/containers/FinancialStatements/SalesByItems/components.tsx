import {
  Classes,
  Intent,
  Menu,
  MenuItem,
  ProgressBar,
  Text,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import { useSalesByItemsContext } from './SalesByItemProvider';
import type {
  SalesByItemsXlsxQuery,
  SalesByItemsCsvQuery,
} from '@bigcapital/sdk-ts';
import { AppToaster, If, Stack } from '@/components';
import {
  useSalesByItemsCsvExport,
  useSalesByItemsXlsxExport,
} from '@/hooks/query';

/**
 * sales by items progress loading bar.
 */
export function SalesByItemsLoadingBar() {
  const { isFetching } = useSalesByItemsContext();
  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Retrieves the sales by items export menu.
 */
export const SalesByItemsSheetExportMenu = () => {
  const commonToastConfig = { isCloseButtonShown: true, timeout: 2000 };
  const { httpQuery } = useSalesByItemsContext();

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

  const { mutateAsync: xlsxExport } = useSalesByItemsXlsxExport(
    httpQuery as SalesByItemsXlsxQuery,
  );
  const { mutateAsync: csvExport } = useSalesByItemsCsvExport(
    httpQuery as SalesByItemsCsvQuery,
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
