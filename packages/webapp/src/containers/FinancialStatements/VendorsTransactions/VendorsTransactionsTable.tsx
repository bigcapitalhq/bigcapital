// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { DataTable, FinancialSheet } from '@/components';

import { useVendorsTransactionsColumns } from './components';
import { useVendorsTransactionsContext } from './VendorsTransactionsProvider';

import { defaultExpanderReducer, tableRowTypesToClassnames } from '@/utils';
import { TableStyle } from '@/constants';

/**
 * Vendors transactions table.
 */

export default function VendorsTransactionsTable({
  // #ownProps
  companyName,
}) {
  // Vendor transactions context.
  const { vendorsTransactions, isVendorsTransactionsLoading } =
    useVendorsTransactionsContext();

  const { table, query } = vendorsTransactions;

  // Retireve vendor transactions table columns.
  const columns = useVendorsTransactionsColumns();

  const expandedRows = useMemo(
    () => defaultExpanderReducer(table.rows, 5),
    [table.rows],
  );

  return (
    <FinancialSheet
      name="vendor-transactions"
      companyName={companyName}
      sheetType={intl.get('vendors_transactions')}
      loading={isVendorsTransactionsLoading}
      fromDate={query.from_date}
      toDate={query.to_date}
      fullWidth={true}
    >
      <VendorsTransactionsDataTable
        columns={columns}
        data={table.rows}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
        expandable={true}
        expanded={expandedRows}
        expandToggleColumn={1}
        expandColumnSpace={0.8}
        sticky={true}
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}

const VendorsTransactionsDataTable = styled(DataTable)`
  --color-table-border-left-color: #ececec;
  --color-table-customer-border-color: #ddd;
  --color-table-border-left-color: var(--color-dark-gray4);
  --color-table-customer-border-color: var(--color-dark-gray4);

  .table {
    .tbody {
      .tr .td {
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
      }
      .tr:not(.no-results) .td:not(:first-of-type) {
        border-left: 1px solid var(--color-table-border-left-color);
      }
      .tr:last-child .td {
        border-bottom-width: 1px;
      }
      .tr.row_type {
        &--VENDOR {
          .td {
            &.vendor_name {
              font-weight: 500;
            }
          }
          &:not(:first-child).is-expanded .td {
            border-top: 1px solid var(--color-table-customer-border-color);
          }
        }
        &--OPENING_BALANCE,
        &--CLOSING_BALANCE {
          font-weight: 500;
        }
        &--VENDOR {
          &.is-expanded {
            .td.running_balance .cell-inner {
              display: none;
            }
          }
          &:not(:first-child).is-expanded .td {
            border-top: 1px solid var(--color-table-customer-border-color);
          }
        }
        &--VENDOR:last-child {
          .td {
            border-bottom: 1px solid var(--color-table-customer-border-color);
          }
        }
      }
    }
  }
`;
