// @ts-nocheck
import React, { useRef } from 'react';
import intl from 'react-intl-universal';
import * as R from 'ramda';
import classNames from 'classnames';

import { AppToaster, If, Stack } from '@/components';
import { Align, CLASSES } from '@/constants';
import { useVendorsBalanceSummaryContext } from './VendorsBalanceSummaryProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { Intent, Menu, MenuItem, ProgressBar, Text } from '@blueprintjs/core';
import {
  useVendorBalanceSummaryCsvExport,
  useVendorBalanceSummaryXlsxExport,
} from '@/hooks/query';

/**
 * Retrieve vendors balance summary columns.
 */
export const useVendorsBalanceColumns = () => {
  const {
    VendorBalanceSummary: { table },
  } = useVendorsBalanceSummaryContext();

  return React.useMemo(() => {
    return dynamicColumns(table.columns || []);
  }, [table.columns]);
};

/**
 * Vendor name accessor.
 */
const vendorColumnAccessor = () => ({
  Header: intl.get('vendor_name'),
  accessor: 'cells[0].value',
  className: 'vendor_name',
  width: 240,
  align: 'left',
  textOverview: true,
});

/**
 * Percentage column accessor.
 */
const percentageColumnAccessor = () => ({
  Header: intl.get('percentage_of_column'),
  accessor: 'cells[2].value',
  className: 'total',
  width: 140,
  textOverview: true,
  align: Align.Right,
});

/**
 * Total column accessor.
 */
const totalColumnAccessor = () => ({
  Header: intl.get('total'),
  accessor: 'cells[1].value',
  className: 'total',
  width: 140,
  textOverview: true,
  align: Align.Right,
});

/**
 * Composes the response columns to table component columns.
 */
const dynamicColumns = (columns) => {
  return R.map(
    R.compose(
      R.when(R.pathEq(['key'], 'name'), vendorColumnAccessor),
      R.when(R.pathEq(['key'], 'total'), totalColumnAccessor),
      R.when(
        R.pathEq(['key'], 'percentage_of_column'),
        percentageColumnAccessor,
      ),
    ),
  )(columns);
};

/**
 * vendors balance summary loading bar.
 */
export function VendorsSummarySheetLoadingBar() {
  const { isVendorsBalanceFetching } = useVendorsBalanceSummaryContext();
  return (
    <If condition={isVendorsBalanceFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * Vendor summary sheet export menu.
 * @returns {JSX.Element}
 */
export function VendorSummarySheetExportMenu() {
  const toastKey = useRef(null);
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
  const openProgressToast = (amount: number) => {
    return (
      <Stack spacing={8}>
        <Text>The report has been exported successfully.</Text>
        <ProgressBar
          className={classNames('toast-progress', {
            [CLASSES.PROGRESS_NO_STRIPES]: amount >= 100,
          })}
          intent={amount < 100 ? Intent.PRIMARY : Intent.SUCCESS}
          value={amount / 100}
        />
      </Stack>
    );
  };

  // Export the report to xlsx.
  const { mutateAsync: xlsxExport } = useVendorBalanceSummaryXlsxExport({
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
  const { mutateAsync: csvExport } = useVendorBalanceSummaryCsvExport({
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
}
