// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { TableStyle } from '@/constants';
import { tableRowTypesToClassnames } from '@/utils';
import { ReportDataTable, FinancialSheet } from '@/components';

import { useTrialBalanceSheetContext } from './TrialBalanceProvider';
import { useTrialBalanceSheetTableColumns } from './hooks';

/**
 * Trial Balance sheet data table.
 */
export default function TrialBalanceSheetTable({ companyName }) {
  // Trial balance sheet context.
  const {
    trialBalanceSheet: { table, query },
    isLoading,
  } = useTrialBalanceSheetContext();

  // Trial balance sheet table columns.
  const columns = useTrialBalanceSheetTableColumns();

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('trial_balance_sheet')}
      fromDate={query.from_date}
      toDate={query.to_date}
      name="trial-balance"
      loading={isLoading}
      basis={'cash'}
    >
      <TrialBalanceDataTable
        columns={columns}
        data={table.rows}
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
  .table {
    .tbody {
      .tr .td {
        border-bottom: 0;
        padding-top: 0.36rem;
        padding-bottom: 0.36rem;
      }
      .balance.td {
        border-top-color: #000;
      }
      .tr.row_type--TOTAL .td {
        border-top: 1px solid #bbb;
        font-weight: 500;
        border-bottom: 3px double #000;
      }
    }
  }
`;
