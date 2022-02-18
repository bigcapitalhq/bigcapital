import React from 'react';
import styled from 'styled-components';

import { Align } from 'common';
import { SkeletonText, DataTable } from 'components';

import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';
import { TableStyle } from 'common';
import {
  FinancialSheetRoot,
  FinancialSheetTitle,
  FinancialSheetType,
  FinancialSheetDate,
  FinancialSheetTable,
} from './StyledFinancialSheet';

/**
 * Financial sheet paper skeleton.
 * @returns {React.JSX}
 */
export function FinancialSheetSkeleton({
  minimal,
  fullWidth,
  titleCharsLength,
  typeCharsLength,
  dateCharsLength,
  skeletonTableColumns,
}) {
  return (
    <FinancialSheetRoot minimal={minimal} fullWidth={fullWidth}>
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
        <DataTable
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

FinancialSheetSkeleton.defaultProps = {
  titleCharsLength: 20,
  typeCharsLength: 40,
  dateCharsLength: 20,
  skeletonTableColumns: [
    {
      id: 'skeleton-1',
      className: 'skeleton-1',
    },
    {
      id: 'skeleton-2',
      className: 'skeleton-2',
      align: Align.Right,
    },
  ],
};