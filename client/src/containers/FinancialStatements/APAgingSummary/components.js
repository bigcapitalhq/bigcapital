import React, { useMemo } from 'react';
import { useAPAgingSummaryContext } from './APAgingSummaryProvider';
import { getColumnWidth } from 'utils';
import { FormattedMessage as T } from 'react-intl';
import { If } from 'components';
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
        `${agingColumn.before_days} - ${agingColumn.to_days || 'And Over'}`,
    );
  }, [columns]);

  return useMemo(
    () => [
      {
        Header: <T id={'vendor_name'} />,
        accessor: 'name',
        className: 'name',
        width: 240,
        sticky: 'left',
        textOverview: true,
      },
      {
        Header: <T id={'current'} />,
        accessor: 'current',
        className: 'current',
        width: getColumnWidth(tableRows, `current`, {
          minWidth: 120,
        }),
      },
      ...agingColumns.map((agingColumn, index) => ({
        Header: agingColumn,
        accessor: `aging-${index}`,
        width: getColumnWidth(tableRows, `aging-${index}`, {
          minWidth: 120,
        }),
      })),
      {
        Header: <T id={'total'} />,
        accessor: 'total',
        width: getColumnWidth(tableRows, 'total', {
          minWidth: 120,
        }),
      },
    ],
    [tableRows, agingColumns],
  );
};

/**
 * A/P aging summary sheet loading bar.
 */
 export function APAgingSummarySheetLoadingBar() {
  const {
    isAPAgingFetching
  } = useAPAgingSummaryContext();

  return (
    <If condition={isAPAgingFetching}>
      <FinancialLoadingBar />
    </If>
  )
}