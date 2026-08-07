import {
  Classes,
  Intent,
  Menu,
  MenuItem,
  ProgressBar,
  Text,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { useMemo } from 'react';
import intl from 'react-intl-universal';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import { useInventoryValuationContext } from './InventoryValuationProvider';
import type {
  InventoryValuationXlsxQuery,
  InventoryValuationCsvQuery,
} from '@bigcapital/sdk-ts';
import { AppToaster, If, Stack } from '@/components';
import { CellTextSpan } from '@/components/Datatable/Cells';
import { Align } from '@/constants';
import {
  useInventoryValuationCsvExport,
  useInventoryValuationXlsxExport,
} from '@/hooks/query';
import { getColumnWidth } from '@/utils';

export const useInventoryValuationTableColumns = () => {
  // inventory valuation context
  const { inventoryValuation } = useInventoryValuationContext();
  const tableRows = (inventoryValuation as any)?.tableRows ?? [];

  return useMemo(
    () => [
      {
        Header: intl.get('item_name'),
        accessor: (row: Record<string, unknown>) =>
          row.code ? `${row.name} - ${row.code}` : row.name,
        className: 'name',
        width: 240,
        textOverview: true,
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantityFormatted',
        Cell: CellTextSpan,
        className: 'quantityFormatted',
        width: getColumnWidth(tableRows, `quantityFormatted`, {
          minWidth: 120,
        }),
        textOverview: true,
        align: Align.Right,
      },
      {
        Header: intl.get('asset_value'),
        accessor: 'valuationFormatted',
        Cell: CellTextSpan,
        className: 'valuation',
        width: getColumnWidth(tableRows, `valuationFormatted`, {
          minWidth: 120,
        }),
        textOverview: true,
        align: Align.Right,
      },
      {
        Header: intl.get('average'),
        accessor: 'averageFormatted',
        Cell: CellTextSpan,
        className: 'averageFormatted',
        width: getColumnWidth(tableRows, `averageFormatted`, {
          minWidth: 120,
        }),
        textOverview: true,
        align: Align.Right,
      },
    ],
    [tableRows],
  );
};

/**
 * inventory valuation progress loading bar.
 */
export function InventoryValuationLoadingBar() {
  const { isFetching } = useInventoryValuationContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Retrieves the inventory valuation sheet export menu.
 * @returns {JSX.Element}
 */
export const InventoryValuationExportMenu = () => {
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { query } = useInventoryValuationContext();

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

  const { mutateAsync: xlsxExport } = useInventoryValuationXlsxExport(
    query as InventoryValuationXlsxQuery,
  );
  const { mutateAsync: csvExport } = useInventoryValuationCsvExport(
    query as InventoryValuationCsvQuery,
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
