import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useBatchDetailsContext } from './BatchDetailsProvider';
import { FinancialSheet, ReportDataTable } from '@/components';
import { Align, TableStyle } from '@/constants';
import { getReportRowTestId } from '@/containers/FinancialStatements/reportTestIds';
import { tableRowTypesToClassnames } from '@/utils';

interface BatchDetailsTableProps {
  companyName: string;
}

const NUMERIC_COLUMNS = ['quantity_in', 'quantity_out', 'quantity_on_hand'];

/**
 * Batch details report table columns.
 */
function useBatchDetailsColumns() {
  const { batchDetails } = useBatchDetailsContext();

  return React.useMemo(
    () =>
      (batchDetails?.table?.columns ?? []).map((column, index) => ({
        id: column.key,
        key: column.key,
        Header: column.label,
        accessor: `cells[${index}].value`,
        disableSortBy: true,
        align: NUMERIC_COLUMNS.includes(column.key) ? Align.Right : Align.Left,
        width: column.key === 'item_name' ? 200 : 130,
        className: column.key,
        money: false,
      })),
    [batchDetails],
  );
}

/**
 * Batch details report table.
 */
export function BatchDetailsTable({ companyName }: BatchDetailsTableProps) {
  const { batchDetails } = useBatchDetailsContext();
  const columns = useBatchDetailsColumns();
  const table = batchDetails?.table;
  const meta = batchDetails?.meta;

  return (
    <BatchDetailsSheet
      companyName={companyName}
      sheetType={intl.get('batch_details')}
      dateText={meta?.formattedDateRange ?? meta?.formattedAsDate}
      fullWidth={true}
    >
      <ReportDataTable
        columns={columns}
        data={table?.rows ?? []}
        rowClassNames={tableRowTypesToClassnames}
        rowTestId={getReportRowTestId('batch-details')}
        noInitialFetch={true}
        noResults={intl.get('batch.no_results')}
        sticky={true}
        styleName={TableStyle.Constrant}
      />
    </BatchDetailsSheet>
  );
}

const BatchDetailsSheet = styled(FinancialSheet)`
  min-width: 900px;

  .table .tbody .tr .td {
    border-bottom-width: 0;
  }
`;
