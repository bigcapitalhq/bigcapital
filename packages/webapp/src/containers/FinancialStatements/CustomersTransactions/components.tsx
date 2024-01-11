// @ts-nocheck
import React, { useRef } from 'react';
import intl from 'react-intl-universal';
import { AppToaster, If, Stack } from '@/components';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import { useCustomersTransactionsContext } from './CustomersTransactionsProvider';
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
  useCustomersTransactionsCsvExport,
  useCustomersTransactionsXlsxExport,
} from '@/hooks/query';
import classNames from 'classnames';

/**
 * Retrieve customers transactions columns.
 */
export const useCustomersTransactionsColumns = () => {
  const {
    customersTransactions: { tableRows },
  } = useCustomersTransactionsContext();

  return React.useMemo(
    () => [
      {
        Header: intl.get('customer_name'),
        accessor: 'cells[0].value',
        className: 'customer_name',
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
        width: 120,
        textOverview: true,
      },
      {
        Header: intl.get('transaction_type'),
        accessor: 'cells[3].value',
        width: 120,
        textOverview: true,
      },
      {
        Header: intl.get('credit'),
        accessor: 'cells[4].value',
        className: 'credit',
        textOverview: true,
        width: getColumnWidth(tableRows, 'cells[5].value', {
          minWidth: 100,
          magicSpacing: 10,
        }),
        align: Align.Right,
      },
      {
        Header: intl.get('debit'),
        accessor: 'cells[5].value',
        className: 'debit',
        textOverview: true,
        width: getColumnWidth(tableRows, 'cells[6].value', {
          minWidth: 100,
          magicSpacing: 10,
        }),
        align: Align.Right,
      },
      {
        Header: intl.get('running_balance'),
        accessor: 'cells[6].value',
        className: 'running_balance',
        textOverview: true,
        width: getColumnWidth(tableRows, 'cells[7].value', {
          minWidth: 120,
          magicSpacing: 10,
        }),
        align: Align.Right,
      },
    ],
    [tableRows],
  );
};

/**
 * customers transactions loading bar.
 */
export function CustomersTransactionsLoadingBar() {
  const { isCustomersTransactionsFetching } = useCustomersTransactionsContext();

  return (
    <If condition={isCustomersTransactionsFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Customers transactions export menu.
 * @returns {JSX.Element}
 */
export function CustomersTransactionsExportMenu() {
  const toastKey = useRef(null);
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { query } = useCustomersTransactionsContext();

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
  const { mutateAsync: xlsxExport } = useCustomersTransactionsXlsxExport(
    query,
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
  const { mutateAsync: csvExport } = useCustomersTransactionsCsvExport(query, {
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
