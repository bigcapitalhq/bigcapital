import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { getReportRowTestId } from '../reportTestIds';
import { useInventoryTurnoverByAmountColumns } from './dynamicColumns';
import { useInventoryTurnoverByAmountContext } from './InventoryTurnoverByAmountProvider';
import { FinancialSheet, ReportDataTable } from '@/components';
import { TableStyle } from '@/constants';
import { tableRowTypesToClassnames } from '@/utils';

interface InventoryTurnoverByAmountTableProps {
  companyName: string;
}

/**
 * Inventory turnover by amount data table.
 */
export function InventoryTurnoverByAmountTable({
  companyName,
}: InventoryTurnoverByAmountTableProps) {
  const { inventoryTurnoverByAmount } = useInventoryTurnoverByAmountContext();

  const table = inventoryTurnoverByAmount?.table;
  const meta = inventoryTurnoverByAmount?.meta;

  const columns = useInventoryTurnoverByAmountColumns();

  return (
    <InventoryTurnoverByAmountSheet
      companyName={companyName}
      sheetType={intl.get('inventory_turnover_by_amount')}
      dateText={meta?.formattedDateRange}
    >
      <InventoryTurnoverByAmountDataTable
        columns={columns}
        data={table?.rows ?? []}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
        rowClassNames={tableRowTypesToClassnames}
        rowTestId={getReportRowTestId('inventory-turnover-by-amount')}
        styleName={TableStyle.Constrant}
        noResults={intl.get(
          'there_were_no_inventory_transactions_during_the_selected_date_range',
        )}
      />
    </InventoryTurnoverByAmountSheet>
  );
}

const InventoryTurnoverByAmountSheet = styled(FinancialSheet)`
  min-width: 1100px;
`;

const InventoryTurnoverByAmountDataTable = styled(ReportDataTable)`
  --color-table-text-color: #252a31;
  --color-table-total-text-color: #000;
  --color-table-total-border: #bbb;

  .bp4-dark & {
    --color-table-text-color: var(--color-light-gray1);
    --color-table-total-text-color: var(--color-light-gray4);
    --color-table-total-border: var(--color-dark-gray5);
  }

  .table {
    .tbody {
      .tr .td {
        border-bottom: 0;
        padding-top: 0.4rem;
        padding-bottom: 0.4rem;
        color: var(--color-table-text-color);
      }
      .tr.row_type--TOTAL .td {
        border-top: 1px solid var(--color-table-total-border);
        border-bottom: 3px double var(--color-table-total-border);
        font-weight: 500;
        color: var(--color-table-total-text-color);
      }
    }
  }
`;
