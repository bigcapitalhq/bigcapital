import React from 'react';
import styled from 'styled-components';
import { getReportRowTestId } from '../reportTestIds';
import { useBudgetVsActualContext } from './BudgetVsActualBoot';
import { useBudgetVsActualColumns } from './utils';
import { ReportDataTable, FinancialSheet } from '@/components';
import { TableStyle } from '@/constants';
import { useCurrentOrganizationName } from '@/hooks/query';
import { tableRowTypesToClassnames } from '@/utils';

function BudgetVsActualTableRoot() {
  const organizationName = useCurrentOrganizationName();
  const { budgetVsActual } = useBudgetVsActualContext();

  const table = (budgetVsActual as any)?.table;
  const meta = (budgetVsActual as any)?.meta;

  // Retrieve the report columns.
  const columns = useBudgetVsActualColumns();

  return (
    <FinancialSheet
      companyName={organizationName}
      sheetType={meta?.sheetName ?? 'Budget vs Actual'}
      dateText={meta?.formattedDateRange}
    >
      <BudgetVsActualDataTable
        columns={columns}
        data={table?.rows ?? []}
        rowClassNames={tableRowTypesToClassnames}
        rowTestId={getReportRowTestId('budget-vs-actual')}
        noInitialFetch={true}
        headerLoading={true}
        sticky={true}
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}

const BudgetVsActualDataTable = styled(ReportDataTable)`
  --color-table-total-border-top: #bbb;
  --color-table-total-border-bottom: #333;

  .bp4-dark & {
    --color-table-total-border-top: var(--color-dark-gray5);
    --color-table-total-border-bottom: var(--color-dark-gray5);
  }
  .table {
    .tbody .tr {
      .td {
        border-bottom: 0;
        padding-top: 0.32rem;
        padding-bottom: 0.32rem;
      }
      &:not(.no-results) {
        .td {
          border-bottom: 0;
          padding-top: 0.4rem;
          padding-bottom: 0.4rem;
        }
        &:not(:first-child) .td {
          border-top: 1px solid transparent;
        }
        &.row_type--TOTAL {
          font-weight: 500;

          .td {
            border-top: 1px solid var(--color-table-total-border-top);
            border-bottom: 3px double var(--color-table-total-border-bottom);
          }
        }
      }
    }
  }
`;

export const BudgetVsActualTable = BudgetVsActualTableRoot;
