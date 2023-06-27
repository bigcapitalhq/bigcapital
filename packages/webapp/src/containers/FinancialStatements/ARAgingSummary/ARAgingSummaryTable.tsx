// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { TableStyle } from '@/constants';
import { ReportDataTable, FinancialSheet } from '@/components';

import { useARAgingSummaryContext } from './ARAgingSummaryProvider';
import { useARAgingSummaryColumns } from './components';

import { tableRowTypesToClassnames } from '@/utils';

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

  return (
    <FinancialSheet
      companyName={organizationName}
      sheetType={intl.get('receivable_aging_summary')}
      asDate={new Date()}
      loading={isARAgingLoading}
    >
      <ARAgingSummaryDataTable
        columns={columns}
        data={ARAgingSummary.tableRows}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
        sticky={true}
        styleName={TableStyle.Constraint}
      />
    </FinancialSheet>
  );
}

const ARAgingSummaryDataTable = styled(ReportDataTable)`
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
