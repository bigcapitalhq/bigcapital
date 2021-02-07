import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import { CellTextSpan } from 'components/Datatable/Cells';
import { useTrialBalanceSheetContext } from './TrialBalanceProvider';

import { getColumnWidth } from 'utils';

/**
 * Trial Balance sheet data table.
 */
export default function TrialBalanceSheetTable({
  companyName,
}) {
  const { formatMessage } = useIntl();

  // Trial balance sheet context.
  const {
    trialBalanceSheet: { tableRows, query },
    isLoading
  } = useTrialBalanceSheetContext();

  const columns = useMemo(
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

  const rowClassNames = (row) => {
    const { original } = row;
    const rowTypes = Array.isArray(original.rowType)
      ? original.rowType
      : [original.rowType];

    return {
      ...rowTypes.reduce((acc, rowType) => {
        acc[`row_type--${rowType}`] = rowType;
        return acc;
      }, {}),
    };
  };

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={formatMessage({ id: 'trial_balance_sheet' })}
      fromDate={query.from_date}
      toDate={query.to_date}
      name="trial-balance"
      loading={isLoading}
      basis={'cash'}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={tableRows}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
        rowClassNames={rowClassNames}
      />
    </FinancialSheet>
  );
}
