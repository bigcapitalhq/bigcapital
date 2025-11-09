// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { TableStyle } from '@/constants';
import { ReportDataTable, FinancialSheet } from '@/components';
import { tableRowTypesToClassnames } from '@/utils';
import { useVendorsBalanceColumns } from './components';
import { useVendorsBalanceSummaryContext } from './VendorsBalanceSummaryProvider';

/**
 * Vendors balance summary table.
 */
export default function VendorsBalanceSummaryTable({
  //#ownProps
  organizationName,
}) {
  const {
    VendorBalanceSummary: { table, query },
  } = useVendorsBalanceSummaryContext();

  // vendors balance summary columns.
  const columns = useVendorsBalanceColumns();

  return (
    <VendorBalanceFinancialSheet
      companyName={organizationName}
      sheetType={intl.get('vendors_balance_summary')}
      asDate={query.as_date}
    >
      <VendorBalanceDataTable
        columns={columns}
        data={table.rows}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
        sticky={true}
        styleName={TableStyle.Constrant}
      />
    </VendorBalanceFinancialSheet>
  );
}

const VendorBalanceFinancialSheet = styled(FinancialSheet)``;

const VendorBalanceDataTable = styled(ReportDataTable)`
  --x-table-total-border-bottom-color: #333;
  --x-table-total-border-top-color: #bbb;
  --x-table-total-border-bottom-color: var(
    --color-datatable-constrant-cell-border
  );
  --x-table-total-border-top-color: var(
    --color-datatable-constrant-cell-border
  );

  .table {
    .tbody {
      .tr:not(.no-results) {
        .td {
          border-bottom-width: 0;
          padding-top: 0.4rem;
          padding-bottom: 0.4rem;
        }
        &.row_type--TOTAL {
          .td {
            font-weight: 500;
            border-top-width: 1px;
            font-weight: 500;
            border-top-width: 1px;
            border-top-style: solid;
            border-top-color: var(--x-table-total-border-top-color);
            border-bottom-style: double;
            border-bottom-width: 3px;
            border-bottom-color: var(--x-table-total-border-bottom-color);
          }
        }
      }
    }
  }
`;
