// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { ActionMenu } from './components';
import { useProjectPurchasesColumns } from './hooks';
import {
  DataTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { TABLES } from '@/constants/tables';
import { useMemorizedColumnsWidths } from '@/hooks';
import { useProjectDetailContext } from '../ProjectDetailProvider';

/**
 * Project Purchases DataTable.
 * @returns
 */
function ProjectPurchasesTableRoot() {
  // Settings hook.
  const { projectSettings } = useProjectDetailContext();
  const purchasesTableSize = projectSettings?.tableSize;

  // Retrieve purchases table columns.
  const columns = useProjectPurchasesColumns();

  // Handle delete purchase.
  const handleDeletePurchase = () => {};

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.PURCHASES);

  return (
    <DataTable
      columns={columns}
      data={[]}
      manualSortBy={true}
      selectionColumn={true}
      noInitialFetch={true}
      sticky={true}
      ContextMenu={ActionMenu}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      size={purchasesTableSize}
      payload={{
        onDelete: handleDeletePurchase,
      }}
    />
  );
}
export const ProjectPurchasesTable = ProjectPurchasesTableRoot;
