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
import intl from 'react-intl-universal';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import { useCustomersTransactionsContext } from './CustomersTransactionsProvider';
import type {
  TransactionsByCustomersXlsxQuery,
  TransactionsByCustomersCsvQuery,
} from '@bigcapital/sdk-ts';
import { AppToaster, If, Stack } from '@/components';
import { Align } from '@/constants';
import {
  useCustomersTransactionsCsvExport,
  useCustomersTransactionsXlsxExport,
} from '@/hooks/query';
import { getColumnWidth } from '@/utils';

/**
 * Retrieve customers transactions columns.
 */
export const useCustomersTransactionsColumns = () => {
  const { customersTransactions } = useCustomersTransactionsContext();
  const tableRows = (customersTransactions as any)?.tableRows;

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
          magicSpacing: 12,
        }),
        align: Align.Right,
        money: true,
      },
      {
        Header: intl.get('debit'),
        accessor: 'cells[5].value',
        className: 'debit',
        textOverview: true,
        width: getColumnWidth(tableRows, 'cells[6].value', {
          minWidth: 100,
          magicSpacing: 12,
        }),
        align: Align.Right,
        money: true,
      },
      {
        Header: intl.get('running_balance'),
        accessor: 'cells[6].value',
        className: 'running_balance',
        textOverview: true,
        width: getColumnWidth(tableRows, 'cells[7].value', {
          minWidth: 120,
          magicSpacing: 12,
        }),
        align: Align.Right,
        money: true,
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
 */
export function CustomersTransactionsExportMenu() {
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { query } = useCustomersTransactionsContext();

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

  const { mutateAsync: xlsxExport } = useCustomersTransactionsXlsxExport(
    query as TransactionsByCustomersXlsxQuery,
  );
  const { mutateAsync: csvExport } = useCustomersTransactionsCsvExport(
    query as TransactionsByCustomersCsvQuery,
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
