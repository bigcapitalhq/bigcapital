import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useARAgingSummaryContext } from './ARAgingSummaryProvider';
import { useARAgingSummaryColumns } from './components';
import { ReportDataTable, FinancialSheet } from '@/components';
import { TableStyle } from '@/constants';
import { tableRowTypesToClassnames } from '@/utils';

interface ARAgingSummaryTableProps {
  organizationName: string;
}

export function ARAgingSummaryTable({
  organizationName,
}: ARAgingSummaryTableProps) {
  const { ARAgingSummary } = useARAgingSummaryContext();

  const columns = useARAgingSummaryColumns();
  const table = (ARAgingSummary as any)?.table;
  const meta = (ARAgingSummary as any)?.meta;

  return (
    <FinancialSheet
      companyName={organizationName}
      sheetType={intl.get('receivable_aging_summary')}
      dateText={meta?.formattedDateRange ?? meta?.formattedAsDate}
    >
      <ARAgingSummaryDataTable
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

const ARAgingSummaryDataTable = styled(ReportDataTable)`
  --color-table-text-color: #252a31;
  --color-table-total-text-color: #000;
  --color-table-total-border-top: #bbb;

  .bp4-dark & {
    --color-table-text-color: var(--color-light-gray1);
    --color-table-total-text-color: var(--color-light-gray4);
    --color-table-total-border-top: var(--color-dark-gray5);
  }
  .table {
    .tbody .tr {
      .td {
        border-bottom-width: 0;
        padding-top: 0.32rem;
        padding-bottom: 0.32rem;
      }
      &:not(.no-results) {
        .td {
          border-bottom-width: 0;
          padding-top: 0.4rem;
          padding-bottom: 0.4rem;
        }
        &:not(:first-child) .td {
          border-top: 1px solid transparent;
        }
        &.row_type--total {
          font-weight: 500;

          .td {
            border-top: 1px solid var(--color-table-total-border-top);
            border-bottom-width: 3px;
            border-bottom-style: double;
          }
        }
      }
    }
  }
`;
