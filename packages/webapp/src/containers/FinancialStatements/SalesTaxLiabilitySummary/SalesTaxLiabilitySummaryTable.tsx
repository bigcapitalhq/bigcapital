import React from 'react';
import styled from 'styled-components';
import { getReportRowTestId } from '../reportTestIds';
import { useSalesTaxLiabilitySummaryContext } from './SalesTaxLiabilitySummaryBoot';
import { useSalesTaxLiabilitySummaryColumns } from './utils';
import { ReportDataTable, FinancialSheet } from '@/components';
import { TableStyle } from '@/constants';
import { useCurrentOrganizationName } from '@/hooks/query';
import { defaultExpanderReducer, tableRowTypesToClassnames } from '@/utils';

function SalesTaxLiabilitySummaryTableRoot() {
  const organizationName = useCurrentOrganizationName();
  const { salesTaxLiabilitySummary } = useSalesTaxLiabilitySummaryContext();

  const table = salesTaxLiabilitySummary?.table;
  const meta = salesTaxLiabilitySummary?.meta;

  // Retrieve the database columns.
  const columns = useSalesTaxLiabilitySummaryColumns();

  // Retrieve default expanded rows of balance sheet.
  const expandedRows = React.useMemo(
    () => defaultExpanderReducer(table?.rows, 3),
    [table],
  );

  return (
    <FinancialSheet
      companyName={organizationName}
      sheetType={'Sales Tax Liability Summary'}
      dateText={meta?.formattedDateRange}
    >
      <SalesTaxLiabilitySummaryDataTable
        columns={columns}
        data={table?.rows}
        rowClassNames={tableRowTypesToClassnames}
        rowTestId={getReportRowTestId('sales-tax-liability')}
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
  --color-table-total-border-top: #bbb;
  --color-table-total-border-bottom: #333;
  --color-table-tax-rate-text-color: #444;

  .bp4-dark & {
    --color-table-total-border-top: var(--color-dark-gray5);
    --color-table-total-border-bottom: var(--color-dark-gray5);
    --color-table-tax-rate-text-color: var(--color-light-gray2);
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
        &.row_type--Total {
          font-weight: 500;

          .td {
            border-top: 1px solid var(--color-table-total-border-top);
            border-bottom: 3px double var(--color-table-total-border-bottom);
          }
        }
        &.row_type--TaxRate {
          .td {
            &.td-taxPercentage,
            &.td-taxableAmount,
            &.td-collectedTax,
            &.td-taxRate {
              color: var(--color-table-tax-rate-text-color);
            }
          }
        }
      }
    }
  }
`;

export const SalesTaxLiabilitySummaryTable = SalesTaxLiabilitySummaryTableRoot;
