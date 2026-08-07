import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useTrialBalanceSheetTableColumns } from './hooks';
import { useTrialBalanceSheetContext } from './TrialBalanceProvider';
import { ReportDataTable, FinancialSheet } from '@/components';
import { TableStyle } from '@/constants';
import { tableRowTypesToClassnames } from '@/utils';

interface TrialBalanceSheetTableProps {
  companyName: string;
}

/**
 * Trial Balance sheet data table.
 */
export function TrialBalanceSheetTable({
  companyName,
}: TrialBalanceSheetTableProps) {
  // Trial balance sheet context.
  const { trialBalanceSheet } = useTrialBalanceSheetContext();

  const table = (trialBalanceSheet as any)?.table;
  const meta = (trialBalanceSheet as any)?.meta;

  // Trial balance sheet table columns.
  const columns = useTrialBalanceSheetTableColumns();

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('trial_balance_sheet')}
      dateText={meta?.formattedDateRange ?? meta?.formattedAsDate}
      basis={'cash'}
    >
      <TrialBalanceDataTable
        columns={columns}
        data={table?.rows}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
        rowClassNames={tableRowTypesToClassnames}
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}

const TrialBalanceDataTable = styled(ReportDataTable)`
  --color-table-text-color: #252a31;
  --color-table-total-text-color: #000;

  .bp4-dark & {
    --color-table-text-color: var(--color-light-gray1);
    --color-table-total-text-color: var(--color-light-gray4);
  }
  .table {
    .tbody {
      .tr .td {
        border-bottom-width: 0;
        padding-top: 0.36rem;
        padding-bottom: 0.36rem;
        color: var(--color-table-text-color);
      }
      .tr.row_type--TOTAL .td {
        font-weight: 500;
        color: var(--color-table-total-text-color);
        border-top-width: 1px;
        border-top-style: solid;
        border-bottom-width: 3px;
        border-bottom-style: double;
      }
    }
  }
`;
