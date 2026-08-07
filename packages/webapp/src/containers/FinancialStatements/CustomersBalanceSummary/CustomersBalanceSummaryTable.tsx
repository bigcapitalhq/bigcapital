import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useCustomersSummaryColumns } from './components';
import { useCustomersBalanceSummaryContext } from './CustomersBalanceSummaryProvider';
import { ReportDataTable, FinancialSheet } from '@/components';
import { TableStyle } from '@/constants';
import { tableRowTypesToClassnames } from '@/utils';

interface CustomersBalanceSummaryTableProps {
  companyName: string;
}

export function CustomersBalanceSummaryTable({
  companyName,
}: CustomersBalanceSummaryTableProps) {
  const { CustomerBalanceSummary } = useCustomersBalanceSummaryContext();
  const table = (CustomerBalanceSummary as any)?.table;
  const meta = (CustomerBalanceSummary as any)?.meta;

  const columns = useCustomersSummaryColumns();

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('customers_balance_summary')}
      dateText={meta?.formattedDateRange ?? meta?.formattedAsDate}
    >
      <CustomerBalanceDataTable
        columns={columns}
        data={table?.rows ?? []}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
        sticky={true}
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}

const CustomerBalanceDataTable = styled(ReportDataTable)`
  --x-table-total-border-bottom-color: #000;
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
