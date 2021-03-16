import React from 'react';
import { useARAgingSummaryContext } from './ARAgingSummaryProvider';
import { getColumnWidth } from 'utils';
import { FormattedMessage as T } from 'react-intl';
import { If } from 'components';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Retrieve AR aging summary columns.
 */
export const useARAgingSummaryColumns = () => {
  const {
    ARAgingSummary: { tableRows, columns },
  } = useARAgingSummaryContext();

  const agingColumns = React.useMemo(() => {
    return columns.map(
      (agingColumn) =>
        `${agingColumn.before_days} - ${agingColumn.to_days || 'And Over'}`,
    );
  }, [columns]);

  return React.useMemo(
    () => [
      {
        Header: <T id={'customer_name'} />,
        accessor: 'name',
        className: 'customer_name',
        sticky: 'left',
        width: 240,
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
        id: 'total',
        accessor: 'total',
        className: 'total',
        width: getColumnWidth(tableRows, 'total', {
          minWidth: 120,
        }),
      },
    ],
    [tableRows, agingColumns],
  );
};

/**
 * A/R aging summary sheet loading bar.
 */
 export function ARAgingSummarySheetLoadingBar() {
  const {
    isARAgingFetching,
  } = useARAgingSummaryContext();

  return (
    <If condition={isARAgingFetching}>
      <FinancialLoadingBar />
    </If>
  )
}