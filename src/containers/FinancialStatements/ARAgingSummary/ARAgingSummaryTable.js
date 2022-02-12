import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { DataTable, FinancialSheet } from 'components';
import { TableStyle } from 'common';

import { useARAgingSummaryContext } from './ARAgingSummaryProvider';
import { useARAgingSummaryColumns } from './components';

/**
 * AR aging summary table sheet.
 */
export default function ReceivableAgingSummaryTable({
  // #ownProps
  organizationName,
}) {
  // AR aging summary report context.
  const { ARAgingSummary, isARAgingLoading } = useARAgingSummaryContext();

  // AR aging summary columns.
  const columns = useARAgingSummaryColumns();

  const rowClassNames = (row) => [`row-type--${row.original.rowType}`];

  return (
    <FinancialSheet
      companyName={organizationName}
      name={'receivable-aging-summary'}
      sheetType={intl.get('receivable_aging_summary')}
      asDate={new Date()}
      loading={isARAgingLoading}
    >
      <ARAgingSummaryDataTable
        columns={columns}
        data={ARAgingSummary.tableRows}
        rowClassNames={rowClassNames}
        noInitialFetch={true}
        sticky={true}
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}

const ARAgingSummaryDataTable = styled(DataTable)`
  .table {
    .tbody .tr {
      .td {
        border-bottom: 0;
        padding-top: 0.32rem;
        padding-bottom: 0.32rem;
      }
    }
  }
`;
