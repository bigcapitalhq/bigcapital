// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { compose } from 'ramda';

import { TableStyle } from '@/constants';
import { ReportDataTable, FinancialSheet } from '@/components';
import { defaultExpanderReducer, tableRowTypesToClassnames } from '@/utils';
import { useSalesTaxLiabilitySummaryContext } from './SalesTaxLiabilitySummaryBoot';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import { useSalesTaxLiabilitySummaryColumns } from './utils';

/**
 * Balance sheet table.
 */
function SalesTaxLiabilitySummaryTableRoot({
  // #ownProps
  organizationName,
}) {
  // Balance sheet context.
  const {
    salesTaxLiabilitySummary: { table, query },
  } = useSalesTaxLiabilitySummaryContext();

  // Retrieve the database columns.
  const columns = useSalesTaxLiabilitySummaryColumns();

  // Retrieve default expanded rows of balance sheet.
  const expandedRows = React.useMemo(
    () => defaultExpanderReducer(table.rows, 3),
    [table],
  );

  return (
    <FinancialSheet
      companyName={organizationName}
      sheetType={'Sales Tax Liability Summary'}
      fromDate={query.from_date}
      toDate={query.to_date}
      basis={''}
    >
      <SalesTaxLiabilitySummaryDataTable
        columns={columns}
        data={table.rows}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
        expandable={true}
        expanded={expandedRows}
        expandToggleColumn={1}
        expandColumnSpace={0.8}
        headerLoading={true}
        sticky={true}
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}

const SalesTaxLiabilitySummaryDataTable = styled(ReportDataTable)`
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
        &.row_type--Total {
          font-weight: 500;

          .td {
            border-top: 1px solid #bbb;
            border-bottom: 3px double #333;
          }
        }
        &.row_type--TaxRate {
          .td {
            &.td-taxPercentage,
            &.td-taxableAmount,
            &.td-collectedTax,
            &.td-taxRate {
              color: #444;
            }
          }
        }
      }
    }
  }
`;

export const SalesTaxLiabilitySummaryTable = compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(SalesTaxLiabilitySummaryTableRoot);
