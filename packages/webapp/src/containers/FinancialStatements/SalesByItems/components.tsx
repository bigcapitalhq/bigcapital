// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';

import { getColumnWidth } from '@/utils';
import { If, Stack } from '@/components';
import { Align } from '@/constants';
import { CellTextSpan } from '@/components/Datatable/Cells';
import { useSalesByItemsContext } from './SalesByItemProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { Menu, MenuItem, ProgressBar, Text } from '@blueprintjs/core';
import { useBalanceSheetXlsxExport } from '@/hooks/query';

/**
 * Retrieve sales by items table columns.
 */
export const useSalesByItemsTableColumns = () => {
  //sales by items context.
  const {
    salesByItems: { tableRows },
  } = useSalesByItemsContext();

  return useMemo(
    () => [
      {
        Header: intl.get('item_name'),
        accessor: (row) => (row.code ? `${row.name} - ${row.code}` : row.name),
        className: 'name',
        width: 180,
        textOverview: true,
      },
      {
        Header: intl.get('sold_quantity'),
        accessor: 'quantity_sold_formatted',
        Cell: CellTextSpan,
        className: 'quantity_sold',
        width: getColumnWidth(tableRows, `quantity_sold_formatted`, {
          minWidth: 150,
        }),
        textOverview: true,
        align: Align.Right,
      },
      {
        Header: intl.get('sold_amount'),
        accessor: 'sold_cost_formatted',
        Cell: CellTextSpan,
        className: 'sold_cost',
        width: getColumnWidth(tableRows, `sold_cost_formatted`, {
          minWidth: 150,
        }),
        textOverview: true,
        align: Align.Right,
      },
      {
        Header: intl.get('average_price'),
        accessor: 'average_sell_price_formatted',
        Cell: CellTextSpan,
        className: 'average_sell_price',
        width: getColumnWidth(tableRows, `average_sell_price_formatted`, {
          minWidth: 150,
        }),
        textOverview: true,
        align: Align.Right,
      },
    ],
    [tableRows],
  );
};

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
 * @returns {JSX.Element}
 */
export const SalesByItemsSheetExportMenu = () => {
  const toastKey = useRef(null);
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { query } = useBalanceSheetContext();

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
  const { mutateAsync: xlsxExport } = useBalanceSheetXlsxExport(query, {
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
  const { mutateAsync: csvExport } = useBalanceSheetCsvExport(query, {
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
