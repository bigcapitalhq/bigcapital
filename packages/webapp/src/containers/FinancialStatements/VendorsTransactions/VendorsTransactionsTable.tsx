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
  const {
    vendorsTransactions: { tableRows },
    isVendorsTransactionsLoading,
    query,
  } = useVendorsTransactionsContext();

  // Retrieve vendor transactions table columns.
  const columns = useVendorsTransactionsColumns();

  const expandedRows = useMemo(
    () => defaultExpanderReducer(tableRows, 5),
    [tableRows],
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

const VendorsTransactionsDataTable = styled(DataTable)`
  .table {
    .tbody {
      .tr .td {
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
      }
      .tr:not(.no-results) .td {
        border-left: 1px solid #ececec;
      }
      .tr:last-child .td {
        border-bottom: 1px solid #e0e0e0;
      }

      .tr.row_type {
        &--VENDOR {
          .td {
            &.vendor_name {
              font-weight: 500;
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
        &--VENDOR {
          &.is-expanded {
            .td.running_balance .cell-inner {
              display: none;
            }
          }
          &:not(:first-child).is-expanded .td {
            border-top: 1px solid #ddd;
          }
        }
        &--VENDOR:last-child {
          .td {
            border-bottom: 1px solid #ddd;
          }
        }
      }
    }
  }
`;
