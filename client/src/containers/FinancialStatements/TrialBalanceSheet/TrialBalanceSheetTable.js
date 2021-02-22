import React from 'react';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';

import { useTrialBalanceSheetContext } from './TrialBalanceProvider';


import { useTrialBalanceTableColumns } from './components';

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

  // Trial balance sheet table columns.
  const columns = useTrialBalanceTableColumns();;

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
