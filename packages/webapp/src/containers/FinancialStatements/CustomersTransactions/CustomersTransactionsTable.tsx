// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { DataTable, FinancialSheet } from '@/components';

import { useCustomersTransactionsColumns } from './components';
import { useCustomersTransactionsContext } from './CustomersTransactionsProvider';

import { defaultExpanderReducer, tableRowTypesToClassnames } from '@/utils';
import { TableStyle } from '@/constants';

/**
 * Customers transactions table.
 */
export default function CustomersTransactionsTable({
  // #ownProps
  companyName,
}) {
  // Customers transactions context.
  const {
    customersTransactions: { tableRows },
    query,
  } = useCustomersTransactionsContext();

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
      fromDate={query.from_date}
      toDate={query.to_date}
      fullWidth={true}
    >
      <CustomersTransactionsDataTable
        columns={columns}
        data={tableRows}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
        expandable={true}
        expanded={expandedRows}
        expandToggleColumn={1}
        expandColumnSpace={0.8}
        styleName={TableStyle.Constraint}
      />
    </FinancialSheet>
  );
}

const CustomersTransactionsDataTable = styled(DataTable)`
  .table {
    .tbody {
      .tr .td {
        padding-top: 0.36rem;
        padding-bottom: 0.36rem;
      }
      .tr:not(.no-results) .td:not(:first-of-type) {
        border-left: 1px solid #ececec;
      }
      .tr:last-child .td {
        border-bottom: 1px solid #e0e0e0;
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
            border-top: 1px solid #ddd;
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
            border-top: 1px solid #ddd;
          }
        }
        &--CUSTOMER:last-child {
          .td {
            border-bottom: 1px solid #ddd;
          }
        }
      }
    }
  }
`;
