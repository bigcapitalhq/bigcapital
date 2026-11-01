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
import { useVendorsTransactionsContext } from './VendorsTransactionsProvider';
import type {
  TransactionsByVendorsXlsxQuery,
  TransactionsByVendorsCsvQuery,
} from '@bigcapital/sdk-ts';
import { AppToaster, If, Stack } from '@/components';
import { Align } from '@/constants';
import {
  useVendorsTransactionsCsvExport,
  useVendorsTransactionsXlsxExport,
} from '@/hooks/query';
import { getColumnWidth } from '@/utils';

/**
 * Retrieve vendors transactions columns.
 */
export const useVendorsTransactionsColumns = () => {
  const { vendorsTransactions } = useVendorsTransactionsContext();
  const table = (vendorsTransactions as any)?.table;

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
        width: getColumnWidth(table?.rows, 'cells[5].value', {
          minWidth: 100,
          magicSpacing: 10,
        }),
        money: true,
        align: Align.Right,
      },
      {
        Header: intl.get('debit'),
        accessor: 'cells[5].value',
        className: 'debit',
        textOverview: true,
        width: getColumnWidth(table?.rows, 'cells[6].value', {
          minWidth: 100,
          magicSpacing: 10,
        }),
        money: true,
        align: Align.Right,
      },
      {
        Header: intl.get('running_balance'),
        accessor: 'cells[6].value',
        className: 'running_balance',
        textOverview: true,
        width: getColumnWidth(table?.rows, 'cells[7].value', {
          minWidth: 120,
          magicSpacing: 10,
        }),
        money: true,
        align: Align.Right,
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
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { filter: query } = useVendorsTransactionsContext();

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

  const { mutateAsync: xlsxExport } = useVendorsTransactionsXlsxExport(
    query as TransactionsByVendorsXlsxQuery,
  );
  const { mutateAsync: csvExport } = useVendorsTransactionsCsvExport(
    query as TransactionsByVendorsCsvQuery,
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
