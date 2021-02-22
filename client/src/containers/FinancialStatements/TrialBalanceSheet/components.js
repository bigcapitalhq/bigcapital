import React from 'react';
import { useIntl } from 'react-intl';
import { getColumnWidth } from 'utils';
import { CellTextSpan } from 'components/Datatable/Cells';
import { useTrialBalanceSheetContext } from './TrialBalanceProvider';


/**
 * Retrieve trial balance sheet table columns.
 */
export const useTrialBalanceTableColumns = () => {
  const { formatMessage } = useIntl();

  // Trial balance sheet context.
  const {
    trialBalanceSheet: { tableRows },
  } = useTrialBalanceSheetContext();

  return React.useMemo(
    () => [
      {
        Header: formatMessage({ id: 'account_name' }),
        accessor: (row) => (row.code ? `${row.name} - ${row.code}` : row.name),
        className: 'name',
        width: 160,
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'credit' }),
        Cell: CellTextSpan,
        accessor: 'formatted_credit',
        className: 'credit',
        width: getColumnWidth(tableRows, `credit`, {
          minWidth: 95,
        }),
      },
      {
        Header: formatMessage({ id: 'debit' }),
        Cell: CellTextSpan,
        accessor: 'formatted_debit',
        width: getColumnWidth(tableRows, `debit`, { minWidth: 95 }),
      },
      {
        Header: formatMessage({ id: 'balance' }),
        Cell: CellTextSpan,
        accessor: 'formatted_balance',
        className: 'balance',
        width: getColumnWidth(tableRows, `balance`, {
          minWidth: 95,
        }),
      },
    ],
    [tableRows, formatMessage],
  );
};
