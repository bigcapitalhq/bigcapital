import { Intent, Menu, MenuItem, ProgressBar, Text } from '@blueprintjs/core';
import classNames from 'classnames';
import * as R from 'ramda';
import React from 'react';
import intl from 'react-intl-universal';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import { useVendorsBalanceSummaryContext } from './VendorsBalanceSummaryProvider';
import { AppToaster, If, Stack } from '@/components';
import { Align, CLASSES } from '@/constants';
import {
  useVendorBalanceSummaryCsvExport,
  useVendorBalanceSummaryXlsxExport,
} from '@/hooks/query';

interface ColumnDef {
  key: string;
  [prop: string]: unknown;
}

/**
 * Retrieve vendors balance summary columns.
 */
export const useVendorsBalanceColumns = () => {
  const { VendorBalanceSummary } = useVendorsBalanceSummaryContext();
  const table = (VendorBalanceSummary as any)?.table;

  return React.useMemo(() => {
    return dynamicColumns(table?.columns || []);
  }, [table?.columns]);
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
  money: true,
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
  money: true,
});

/**
 * Composes the response columns to table component columns.
 */
const dynamicColumns = (columns: ColumnDef[]) => {
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
  const commonToastConfig = {
    isCloseButtonShown: true,
    timeout: 2000,
  };
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
            [CLASSES.PROGRESS_NO_STRIPES]: done,
          })}
          intent={done ? Intent.SUCCESS : Intent.PRIMARY}
          value={done ? 1 : undefined}
        />
      </Stack>
    );
  };

  const { mutateAsync: xlsxExport } = useVendorBalanceSummaryXlsxExport();
  const { mutateAsync: csvExport } = useVendorBalanceSummaryCsvExport();

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
