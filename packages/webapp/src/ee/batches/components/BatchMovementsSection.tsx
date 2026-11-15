import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  getEntriesBatchMovements,
  type BatchMovementDirection,
  type BatchMovementEntry,
  type BatchMovementRow,
} from './utils';
import {
  CommercialDocEntriesTable,
  FormatDate,
  FormattedMessage as T,
  TextOverviewTooltipCell,
} from '@/components';
import { TableStyle } from '@/constants';
import { Features } from '@/constants/features';
import { useFeatureCan } from '@/hooks/state';
import { formattedNumber } from '@/utils';

interface BatchMovementsSectionProps {
  entries: BatchMovementEntry[];
  direction: BatchMovementDirection;
}

interface BatchQuantityCellProps {
  value: number;
}

interface BatchExpiryDateCellProps {
  value?: string | null;
}

/**
 * Batch movement quantity cell.
 */
function BatchQuantityCell({ value }: BatchQuantityCellProps) {
  return <>{formattedNumber(value, { precision: 2 })}</>;
}

/**
 * Batch movement expiry date cell.
 */
function BatchExpiryDateCell({ value }: BatchExpiryDateCellProps) {
  return value ? <FormatDate value={value} /> : <span>-</span>;
}

/**
 * Batch movement table columns.
 */
const useBatchMovementsColumns = (
  direction: BatchMovementDirection,
  rows: BatchMovementRow[],
) => {
  return React.useMemo(() => {
    const hasBatchRef = rows.some((row) => !!row.batchRef);
    const hasExpiryDate = rows.some((row) => !!row.expiryDate);

    return [
      {
        id: 'item',
        Header: intl.get('item'),
        accessor: 'itemName',
        Cell: TextOverviewTooltipCell,
        disableSortBy: true,
        textOverview: true,
        width: 180,
      },
      {
        id: 'batch_number',
        Header: intl.get('batch.column.batch_number'),
        accessor: 'batchNumber',
        Cell: TextOverviewTooltipCell,
        disableSortBy: true,
        textOverview: true,
        width: 140,
      },
      ...(hasBatchRef
        ? [
            {
              id: 'batch_ref',
              Header: intl.get('batch.column.batch_ref'),
              accessor: 'batchRef',
              disableSortBy: true,
              width: 130,
            },
          ]
        : []),
      ...(hasExpiryDate
        ? [
            {
              id: 'expiry_date',
              Header: intl.get('batch.column.expiry_date'),
              accessor: 'expiryDate',
              Cell: BatchExpiryDateCell,
              disableSortBy: true,
              width: 120,
            },
          ]
        : []),
      {
        id: 'quantity',
        Header: intl.get(
          direction === 'in'
            ? 'batch.column.quantity_in'
            : 'batch.column.quantity_out',
        ),
        accessor: 'quantity',
        Cell: BatchQuantityCell,
        align: 'right',
        disableSortBy: true,
        width: 110,
      },
    ];
  }, [direction, rows]);
};

/**
 * Read-only batch movements section shown in the paper overview of the sale
 * invoice and bill detail drawers.
 */
export function BatchMovementsSection({
  entries,
  direction,
}: BatchMovementsSectionProps) {
  const { featureCan } = useFeatureCan();

  const rows = React.useMemo(
    () => getEntriesBatchMovements(entries, direction),
    [direction, entries],
  );
  const columns = useBatchMovementsColumns(direction, rows);

  if (!featureCan(Features.BatchTracking) || rows.length === 0) {
    return null;
  }

  return (
    <BatchMovementsRoot>
      <BatchMovementsTitle>
        {direction === 'in' ? (
          <T id={'batch.movements.in'} />
        ) : (
          <T id={'batch.movements.out'} />
        )}
      </BatchMovementsTitle>

      <CommercialDocEntriesTable
        columns={columns}
        data={rows}
        styleName={TableStyle.Constrant}
      />
    </BatchMovementsRoot>
  );
}

const BatchMovementsRoot = styled.div`
  margin-top: 28px;
`;

const BatchMovementsTitle = styled.h4`
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 600;
`;
