import React from 'react';
import intl from 'react-intl-universal';

import { useARAgingSummaryContext } from './ARAgingSummaryProvider';
import { If, FormattedMessage as T } from 'components';

import { getColumnWidth } from 'utils';
import { Align } from 'common';
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
        `${agingColumn.before_days} - ${
          agingColumn.to_days || intl.get('and_over')
        }`,
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
        align: Align.Right
      },
      ...agingColumns.map((agingColumn, index) => ({
        Header: agingColumn,
        accessor: `aging-${index}`,
        width: getColumnWidth(tableRows, `aging-${index}`, {
          minWidth: 120,
        }),
        align: Align.Right
      })),
      {
        Header: <T id={'total'} />,
        id: 'total',
        accessor: 'total',
        className: 'total',
        width: getColumnWidth(tableRows, 'total', {
          minWidth: 120,
        }),
        align: Align.Right
      },
    ],
    [tableRows, agingColumns],
  );
};

/**
 * A/R aging summary sheet loading bar.
 */
export function ARAgingSummarySheetLoadingBar() {
  const { isARAgingFetching } = useARAgingSummaryContext();

  return (
    <If condition={isARAgingFetching}>
      <FinancialLoadingBar />
    </If>
  );
}
