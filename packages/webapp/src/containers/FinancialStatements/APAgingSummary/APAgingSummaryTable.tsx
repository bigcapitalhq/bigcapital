// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { TableStyle } from '@/constants';
import { ReportDataTable, FinancialSheet } from '@/components';

import { useAPAgingSummaryContext } from './APAgingSummaryProvider';
import { useAPAgingSummaryColumns } from './components';

import { tableRowTypesToClassnames } from '@/utils';

/**
 * AP aging summary table sheet.
 */
export default function APAgingSummaryTable({
  //#ownProps
  organizationName,
}) {
  // AP aging summary report content.
  const {
    APAgingSummary: { table, query },
    isAPAgingLoading,
  } = useAPAgingSummaryContext();

  // AP aging summary columns.
  const columns = useAPAgingSummaryColumns();

  return (
    <FinancialSheet
      companyName={organizationName}
      sheetType={intl.get('payable_aging_summary')}
      asDate={query.as_date}
      loading={isAPAgingLoading}
    >
      <APAgingSummaryDataTable
        columns={columns}
        data={table.rows}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
        sticky={true}
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}

const APAgingSummaryDataTable = styled(ReportDataTable)`
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
