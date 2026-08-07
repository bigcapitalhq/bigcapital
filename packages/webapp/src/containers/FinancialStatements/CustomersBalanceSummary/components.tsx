import {
  Classes,
  Intent,
  Menu,
  MenuItem,
  ProgressBar,
  Text,
} from '@blueprintjs/core';
import classNames from 'classnames';
import * as R from 'ramda';
import React from 'react';
import intl from 'react-intl-universal';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import { useCustomersBalanceSummaryContext } from './CustomersBalanceSummaryProvider';
import type {
  CustomerBalanceXlsxQuery,
  CustomerBalanceCsvQuery,
} from '@bigcapital/sdk-ts';
import { AppToaster, If, Stack } from '@/components';
import { Align } from '@/constants';
import {
  useCustomerBalanceSummaryCsvExport,
  useCustomerBalanceSummaryXlsxExport,
} from '@/hooks/query';

/**
 * Retrieve customers balance summary columns.
 */
export const useCustomersSummaryColumns = () => {
  const { CustomerBalanceSummary } = useCustomersBalanceSummaryContext();

  return React.useMemo(() => {
    return dynamicColumns(
      (CustomerBalanceSummary as any)?.table?.columns ?? [],
    );
  }, [(CustomerBalanceSummary as any)?.table?.columns]);
};

/**
 * Account name column accessor.
 */
const accountNameColumnAccessor = () => ({
  Header: intl.get('customer_name'),
  accessor: 'cells[0].value',
  className: 'customer_name',
  width: 240,
});

/**
 * Total column accessor.
 */
const totalColumnAccessor = () => ({
  Header: intl.get('total'),
  accessor: 'cells[1].value',
  className: 'total',
  width: 140,
  align: Align.Right,
});

/**
 * Percentage column accessor.
 */
const percentageColumnAccessor = () => ({
  Header: intl.get('percentage_of_column'),
  accessor: 'cells[2].value',
  className: 'total',
  width: 140,
  align: Align.Right,
});

const dynamicColumns = (columns) => {
  return R.map(
    R.compose(
      R.when(R.pathEq(['key'], 'name'), accountNameColumnAccessor),
      R.when(R.pathEq(['key'], 'total'), totalColumnAccessor),
      R.when(
        R.pathEq(['key'], 'percentage_of_column'),
        percentageColumnAccessor,
      ),
    ),
  )(columns);
};

/**
 * customers balance summary loading bar.
 */
export function CustomersBalanceLoadingBar() {
  const { isCustomersBalanceFetching } = useCustomersBalanceSummaryContext();

  return (
    <If condition={isCustomersBalanceFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Customer balance summary export menu.
 */
export function CustomerBalanceSummaryExportMenu() {
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { query } = useCustomersBalanceSummaryContext();

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

  const { mutateAsync: xlsxExport } = useCustomerBalanceSummaryXlsxExport(
    query as CustomerBalanceXlsxQuery,
  );
  const { mutateAsync: csvExport } = useCustomerBalanceSummaryCsvExport(
    query as CustomerBalanceCsvQuery,
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
