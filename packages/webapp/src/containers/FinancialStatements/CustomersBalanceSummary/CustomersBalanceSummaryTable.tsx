// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { TableStyle } from '@/constants';
import { ReportDataTable, FinancialSheet } from '@/components';
import { tableRowTypesToClassnames } from '@/utils';

import { useCustomersBalanceSummaryContext } from './CustomersBalanceSummaryProvider';
import { useCustomersSummaryColumns } from './components';

/**
 * Customers balance summary table.
 */
export default function CustomersBalanceSummaryTable({
  // #ownProps
  companyName,
}) {
  const {
    CustomerBalanceSummary: { table },
  } = useCustomersBalanceSummaryContext();

  // Retrieves the customers summary columns.
  const columns = useCustomersSummaryColumns();

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('customers_balance_summary')}
      asDate={new Date()}
    >
      <CustomerBalanceDataTable
        columns={columns}
        data={table.data}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
        styleName={TableStyle.Constraint}
      />
    </FinancialSheet>
  );
}

const CustomerBalanceDataTable = styled(ReportDataTable)`
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
