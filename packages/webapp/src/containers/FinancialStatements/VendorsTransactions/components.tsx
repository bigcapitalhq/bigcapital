// @ts-nocheck
import React, { useRef } from 'react';
import intl from 'react-intl-universal';
import {
  Classes,
  Intent,
  Menu,
  MenuItem,
  ProgressBar,
  Text,
} from '@blueprintjs/core';
import classNames from 'classnames';

import { AppToaster, If, Stack } from '@/components';
import { useVendorsTransactionsContext } from './VendorsTransactionsProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { getColumnWidth } from '@/utils';
import {
  useVendorsTransactionsCsvExport,
  useVendorsTransactionsXlsxExport,
} from '@/hooks/query';

/**
 * Retrieve vendors transactions columns.
 */
export const useVendorsTransactionsColumns = () => {
  const {
    vendorsTransactions: { table },
  } = useVendorsTransactionsContext();

  return React.useMemo(
    () => [
      {
        Header: intl.get('vendor_name'),
        accessor: 'cells[0].value',
        className: 'vendor_name',
      },
      {
        Header: intl.get('account_name'),
        accessor: 'cells[1].value',
        className: 'name',
        textOverview: true,
        width: 170,
      },
      {
        Header: intl.get('reference_type'),
        accessor: 'cells[2].value',
        textOverview: true,
        width: 120,
      },
      {
        Header: intl.get('transaction_type'),
        accessor: 'cells[3].value',
        textOverview: true,
        width: 120,
      },
      {
        Header: intl.get('credit'),
        accessor: 'cells[4].value',
        className: 'credit',
        textOverview: true,
        width: getColumnWidth(table.rows, 'cells[5].value', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
      {
        Header: intl.get('debit'),
        accessor: 'cells[5].value',
        className: 'debit',
        textOverview: true,
        width: getColumnWidth(table.rows, 'cells[6].value', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
      {
        Header: intl.get('running_balance'),
        accessor: 'cells[6].value',
        className: 'running_balance',
        textOverview: true,
        width: getColumnWidth(table.rows, 'cells[7].value', {
          minWidth: 120,
          magicSpacing: 10,
        }),
      },
    ],
    [table],
  );
};

/**
 * Vendors transactions loading bar.
 */
export function VendorsTransactionsLoadingBar() {
  const { isVendorsTransactionFetching } = useVendorsTransactionsContext();

  return (
    <If condition={isVendorsTransactionFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Vendor transactions export menu.
 */
export function VendorTransactionsExportMenu() {
  const toastKey = useRef(null);
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { query } = useVendorsTransactionsContext();

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
  const { mutateAsync: xlsxExport } = useVendorsTransactionsXlsxExport(query, {
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
  const { mutateAsync: csvExport } = useVendorsTransactionsCsvExport({
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
