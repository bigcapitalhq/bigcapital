import React, { useCallback, useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { getReportRowTestId } from '../reportTestIds';
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
  const { trialBalanceSheet, pageQuery, setPageQuery } =
    useTrialBalanceSheetContext();

  const table = (trialBalanceSheet as any)?.table;
  const meta = (trialBalanceSheet as any)?.meta;
  const query = trialBalanceSheet?.query;

  // Trial balance sheet table columns.
  const columns = useTrialBalanceSheetTableColumns();

  // The initial sorting state is derived from the page query to keep the
  // table header in sync with the backend sorting after a page reload.
  const initialSortBy = useMemo(() => {
    return pageQuery?.columnSortBy
      ? [
          {
            id: pageQuery.columnSortBy,
            desc: pageQuery.sortOrder === 'desc',
          },
        ]
      : [];
  }, [pageQuery?.columnSortBy, pageQuery?.sortOrder]);

  // Stores the sorting state in the page query to let the backend sort the
  // report data instead of sorting the loaded rows on the client.
  const handleFetchData = useCallback(
    ({ sortBy }: { sortBy: Array<{ id: string; desc: boolean }> }) => {
      const [sortedColumn] = sortBy;
      setPageQuery({
        columnSortBy: sortedColumn?.id,
        sortOrder: sortedColumn
          ? sortedColumn.desc
            ? 'desc'
            : 'asc'
          : undefined,
      });
    },
    [setPageQuery],
  );

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('trial_balance_sheet')}
      dateText={meta?.formattedDateRange ?? meta?.formattedAsDate}
      basis={query?.basis}
    >
      <TrialBalanceDataTable
        columns={columns}
        data={table?.rows}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
        manualSortBy={true}
        autoResetSortBy={false}
        initialSortBy={initialSortBy}
        noInitialFetch={true}
        onFetchData={handleFetchData}
        rowClassNames={tableRowTypesToClassnames}
        rowTestId={getReportRowTestId('trial-balance')}
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
