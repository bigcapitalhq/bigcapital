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
    VendorBalanceSummary: { table },
  } = useVendorsBalanceSummaryContext();

  // vendors balance summary columns.
  const columns = useVendorsBalanceColumns();

  return (
    <VendorBalanceFinancialSheet
      companyName={organizationName}
      sheetType={intl.get('vendors_balance_summary')}
      asDate={new Date()}
    >
      <VendorBalanceDataTable
        columns={columns}
        data={table.data}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
        styleName={TableStyle.Constraint}
      />
    </VendorBalanceFinancialSheet>
  );
}

const VendorBalanceFinancialSheet = styled(FinancialSheet)``;

const VendorBalanceDataTable = styled(ReportDataTable)`
  .table {
    .tbody {
      .tr:not(.no-results) {
        .td {
          border-bottom: 0;
          padding-top: 0.4rem;
          padding-bottom: 0.4rem;
        }

        &.row_type--TOTAL {
          font-weight: 500;

          .td {
            border-top: 1px solid #bbb;
            border-bottom: 3px double #333;
          }
        }
      }
    }
  }
`;
