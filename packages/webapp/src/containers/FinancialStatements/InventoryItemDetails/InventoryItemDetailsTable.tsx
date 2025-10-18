// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { ReportDataTable, FinancialSheet } from '@/components';
import { useInventoryItemDetailsColumns } from './components';
import { useInventoryItemDetailsContext } from './InventoryItemDetailsProvider';

import { defaultExpanderReducer, tableRowTypesToClassnames } from '@/utils';
import { TableStyle } from '@/constants';

/**
 * Inventory item detail table.
 */
export function InventoryItemDetailsTable({
  // #ownProps
  companyName,
}) {
  const {
    inventoryItemDetails: { tableRows },
    isInventoryItemDetailsLoading,
    query,
  } = useInventoryItemDetailsContext();

  const columns = useInventoryItemDetailsColumns();

  const expandedRows = useMemo(
    () => defaultExpanderReducer(tableRows, 4),
    [tableRows],
  );

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('inventory_item_details')}
      loading={isInventoryItemDetailsLoading}
      fromDate={query.fromDate}
      toDate={query.toDate}
      fullWidth={true}
    >
      <InventoryItemDetailsDataTable
        columns={columns}
        data={tableRows}
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

const InventoryItemDetailsDataTable = styled(ReportDataTable)`
  --color-table-text: var(--color-light-gray1);
  --color-table-total-text: var(--color-light-gray4);
  --color-table-border: #ececec;
  --color-report-table-border: var(--color-dark-gray4);
  --color-table-total-border: #ddd;
  --color-table-total-border: var(--color-dark-gray4);

  .table {
    .tbody {
      .tr .td {
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
      }

      .tr:not(.no-results) .td:not(:first-of-type) {
        border-left: 1px solid var(--color-report-table-border);
      }
      .tr:last-child .td {
        border-bottom: 1px solid var(--color-table-total-border);
      }
      .tr.row_type {
        &--ITEM {
          .td {
            &.transaction_type {
              border-left-color: transparent;
            }
            &.date {
              .cell-inner {
                white-space: nowrap;
                position: relative;
              }
            }
          }
          &:not(:first-child).is-expanded .td {
            border-top: 1px solid var(--color-table-total-border);
          }
        }

        &--ITEM,
        &--OPENING_ENTRY,
        &--CLOSING_ENTRY {
          font-weight: 500;

          .td {
            color: var(--color-table-total-text);
          }
        }

        &--ITEM {
          &.is-expanded {
            .td.value .cell-inner {
              display: none;
            }
          }
        }
      }
    }
  }
`;
