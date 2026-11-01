import React from 'react';
import styled from 'styled-components';
import {
  DataTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '../Datatable';
import {
  FinancialSheetRoot,
  FinancialSheetTitle,
  FinancialSheetType,
  FinancialSheetDate,
  FinancialSheetTable,
} from './StyledFinancialSheet';
import type { Column } from 'react-table';
import { SkeletonText } from '@/components';
import { Align, TableStyle } from '@/constants';

const defaultSkeletonColumns = [
  { id: 'skeleton-1', className: 'skeleton-1' },
  { id: 'skeleton-2', className: 'skeleton-2', align: Align.Right },
] as unknown as Column<object>[];

interface FinancialSheetSkeletonProps {
  minimal?: boolean;
  fullWidth?: boolean;
  titleCharsLength?: number;
  typeCharsLength?: number;
  dateCharsLength?: number;
  skeletonTableColumns?: Column<object>[];
}

export function FinancialSheetSkeleton({
  minimal,
  fullWidth,
  titleCharsLength = 20,
  typeCharsLength = 40,
  dateCharsLength = 20,
  skeletonTableColumns = defaultSkeletonColumns,
}: FinancialSheetSkeletonProps) {
  return (
    <FinancialSheetRoot $minimal={minimal} $fullWidth={fullWidth}>
      <FinancialSheetTitle>
        <SkeletonText charsLength={titleCharsLength} />
      </FinancialSheetTitle>

      <FinancialSheetType>
        <SkeletonText charsLength={typeCharsLength} />
      </FinancialSheetType>

      <FinancialSheetDate>
        <SkeletonText charsLength={dateCharsLength} />
      </FinancialSheetDate>

      <FinancialSheetTable>
        <FinancialSkeletonTable
          columns={skeletonTableColumns}
          data={[]}
          noInitialFetch={true}
          expandable={true}
          styleName={TableStyle.Constrant}
          TableLoadingRenderer={TableSkeletonRows}
          TableHeaderSkeletonRenderer={TableSkeletonHeader}
          headerLoading={true}
          loading={true}
        />
      </FinancialSheetTable>
    </FinancialSheetRoot>
  );
}

const FinancialSkeletonTable = styled(DataTable)`
  .table .th .skeleton,
  .table .td .skeleton {
    margin-top: 4px;
    margin-bottom: 4px;
  }
`;
