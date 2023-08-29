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
        &.row_type--total {
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
