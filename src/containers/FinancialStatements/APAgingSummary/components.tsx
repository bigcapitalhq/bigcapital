import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { If, FormattedMessage as T } from '@/components';
import { useAPAgingSummaryContext } from './APAgingSummaryProvider';
import { getColumnWidth } from '@/utils';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Retrieve AP aging summary columns.
 */
export const useAPAgingSummaryColumns = () => {
  const {
    APAgingSummary: { tableRows, columns },
  } = useAPAgingSummaryContext();

  const agingColumns = React.useMemo(() => {
    return columns.map(
      (agingColumn) =>
        `${agingColumn.before_days} - ${
          agingColumn.to_days || intl.get('and_over')
        }`,
    );
  }, [columns]);

  return useMemo(
    () => [
      {
        Header: <T id={'vendor_name'} />,
        accessor: 'name',
        className: 'vendor_name',
        width: 240,
        sticky: 'left',
        textOverview: true,
      },
      {
        Header: <T id={'current'} />,
        accessor: 'current',
        className: 'current',
        width: getColumnWidth(tableRows, `current`, { minWidth: 120 }),
      },
      ...agingColumns.map((agingColumn, index) => ({
        Header: agingColumn,
        accessor: `aging-${index}`,
        width: getColumnWidth(tableRows, `aging-${index}`, { minWidth: 120 }),
      })),
      {
        Header: <T id={'total'} />,
        accessor: 'total',
        width: getColumnWidth(tableRows, 'total', { minWidth: 120 }),
      },
    ],
    [tableRows, agingColumns],
  );
};

/**
 * A/P aging summary sheet loading bar.
 */
export function APAgingSummarySheetLoadingBar() {
  const { isAPAgingFetching } = useAPAgingSummaryContext();

  return (
    <If condition={isAPAgingFetching}>
      <FinancialLoadingBar />
    </If>
  );
}
