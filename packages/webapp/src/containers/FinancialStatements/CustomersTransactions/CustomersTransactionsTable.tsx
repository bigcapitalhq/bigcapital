import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useCustomersTransactionsColumns } from './components';
import { useCustomersTransactionsContext } from './CustomersTransactionsProvider';
import { DataTable, FinancialSheet } from '@/components';
import { TableStyle } from '@/constants';
import { defaultExpanderReducer, tableRowTypesToClassnames } from '@/utils';

interface CustomersTransactionsTableProps {
  companyName: string;
}

/**
 * Customers transactions table.
 */
export function CustomersTransactionsTable({
  // #ownProps
  companyName,
}: CustomersTransactionsTableProps) {
  // Customers transactions context.
  const { customersTransactions, query } = useCustomersTransactionsContext();

  const tableRows = (customersTransactions as any)?.tableRows;
  const meta = (customersTransactions as any)?.meta;

  // Customers transactions table columns.
  const columns = useCustomersTransactionsColumns();

  const expandedRows = useMemo(
    () => defaultExpanderReducer(tableRows, 4),
    [tableRows],
  );

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('customers_transactions')}
      dateText={meta?.formattedDateRange ?? meta?.formattedAsDate}
      fullWidth={true}
    >
      <CustomersTransactionsDataTable
        columns={columns}
        data={tableRows}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
        expandable={true}
        expanded={expandedRows}
        sticky={true}
        expandToggleColumn={1}
        expandColumnSpace={0.8}
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}

const CustomersTransactionsDataTable = styled(DataTable)`
  --color-table-border-left-color: #ececec;
  --color-table-customer-border-color: #ddd;
  --color-table-border-left-color: var(--color-dark-gray4);
  --color-table-customer-border-color: var(--color-dark-gray4);

  .table {
    .tbody {
      .tr .td {
        padding-top: 0.36rem;
        padding-bottom: 0.36rem;
      }
      .tr:not(.no-results) .td:not(:first-of-type) {
        border-left: 1px solid var(--color-table-border-left-color);
      }
      .tr:last-child .td {
        border-bottom-width: 1px;
      }

      .tr.row_type {
        &--CUSTOMER {
          .td {
            &.customer_name {
              font-weight: 500;

              .cell-inner {
                white-space: nowrap;
                position: relative;
              }
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
        &--CUSTOMER {
          &.is-expanded {
            .td.running_balance .cell-inner {
              display: none;
            }
          }
          &:not(:first-child).is-expanded .td {
            border-top: 1px solid var(--color-table-customer-border-color);
          }
        }
        &--CUSTOMER:last-child {
          .td {
            border-bottom: 1px solid var(--color-table-customer-border-color);
          }
        }
      }
    }
  }
`;
