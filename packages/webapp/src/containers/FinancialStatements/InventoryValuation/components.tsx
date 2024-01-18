// @ts-nocheck
import { useMemo, useRef } from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { AppToaster, If, Stack } from '@/components';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import { CellTextSpan } from '@/components/Datatable/Cells';
import { useInventoryValuationContext } from './InventoryValuationProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';
import {
  Classes,
  Intent,
  Menu,
  MenuItem,
  ProgressBar,
  Text,
} from '@blueprintjs/core';
import {
  useInventoryValuationCsvExport,
  useInventoryValuationXlsxExport,
} from '@/hooks/query';

/**
 * Retrieve inventory valuation table columns.
 */
export const useInventoryValuationTableColumns = () => {
  // inventory valuation context
  const {
    inventoryValuation: { tableRows },
  } = useInventoryValuationContext();

  return useMemo(
    () => [
      {
        Header: intl.get('item_name'),
        accessor: (row) => (row.code ? `${row.name} - ${row.code}` : row.name),
        className: 'name',
        width: 240,
        textOverview: true,
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantity_formatted',
        Cell: CellTextSpan,
        className: 'quantity_formatted',
        width: getColumnWidth(tableRows, `quantity_formatted`, {
          minWidth: 120,
        }),
        textOverview: true,
        align: Align.Right,
      },
      {
        Header: intl.get('asset_value'),
        accessor: 'valuation_formatted',
        Cell: CellTextSpan,
        className: 'valuation',
        width: getColumnWidth(tableRows, `valuation_formatted`, {
          minWidth: 120,
        }),
        textOverview: true,
        align: Align.Right,
      },
      {
        Header: intl.get('average'),
        accessor: 'average_formatted',
        Cell: CellTextSpan,
        className: 'average_formatted',
        width: getColumnWidth(tableRows, `average_formatted`, {
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
  const toastKey = useRef(null);
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { query } = useInventoryValuationContext();

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
  const { mutateAsync: xlsxExport } = useInventoryValuationXlsxExport(query, {
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
  const { mutateAsync: csvExport } = useInventoryValuationCsvExport(query, {
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
