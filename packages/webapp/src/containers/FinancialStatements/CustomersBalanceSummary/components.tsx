// @ts-nocheck
import React, { useRef } from 'react';
import intl from 'react-intl-universal';
import * as R from 'ramda';
import classNames from 'classnames';

import { AppToaster, If, Stack } from '@/components';
import { Align } from '@/constants';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { useCustomersBalanceSummaryContext } from './CustomersBalanceSummaryProvider';
import {
  Classes,
  Intent,
  Menu,
  MenuItem,
  ProgressBar,
  Text,
} from '@blueprintjs/core';
import {
  useCustomerBalanceSummaryCsvExport,
  useCustomerBalanceSummaryXlsxExport,
} from '@/hooks/query';

/**
 * Retrieve customers balance summary columns.
 */
export const useCustomersSummaryColumns = () => {
  const {
    CustomerBalanceSummary: { table },
  } = useCustomersBalanceSummaryContext();

  return React.useMemo(() => {
    return dynamicColumns(table.columns || []);
  }, [table.columns]);
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
  const toastKey = useRef(null);
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const { query } = useCustomersBalanceSummaryContext();

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
  const { mutateAsync: xlsxExport } = useCustomerBalanceSummaryXlsxExport(
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
  const { mutateAsync: csvExport } = useCustomerBalanceSummaryCsvExport(query, {
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
