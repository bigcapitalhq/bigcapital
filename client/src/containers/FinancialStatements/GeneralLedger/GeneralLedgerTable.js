import React, { useMemo } from 'react';

import { defaultExpanderReducer } from 'utils';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';

import { useGeneralLedgerContext } from './GeneralLedgerProvider';
import { useGeneralLedgerTableColumns } from './components';

/**
 * General ledger table.
 */
export default function GeneralLedgerTable({
  companyName,
}) {
  const { formatMessage } = useIntl();

  // General ledger context.
  const {
    generalLedger: { tableRows, query },
    isSheetLoading
  } = useGeneralLedgerContext();

  // General ledger table columns.
  const columns = useGeneralLedgerTableColumns();

  // Default expanded rows of general ledger table.
  const expandedRows = useMemo(
    () => defaultExpanderReducer(tableRows, 1),
    [tableRows],
  );

  const rowClassNames = (row) => [`row-type--${row.original.rowType}`];

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={formatMessage({ id: 'general_ledger_sheet' })}
      fromDate={query.from_date}
      toDate={query.to_date}
      name="general-ledger"
      loading={isSheetLoading}
      fullWidth={true}
    >
      <DataTable
      className="bigcapital-datatable--financial-report"
        noResults={formatMessage({
          id: 'this_report_does_not_contain_any_data_between_date_period',
        })}
        columns={columns}
        data={tableRows}
        rowClassNames={rowClassNames}
        expanded={expandedRows}
        virtualizedRows={true}
        fixedItemSize={30}
        fixedSizeHeight={1000}
        expandable={true}
        expandToggleColumn={1}
        sticky={true}
      />
    </FinancialSheet>
  );
}