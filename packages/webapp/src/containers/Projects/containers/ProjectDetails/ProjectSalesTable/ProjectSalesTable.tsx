// @ts-nocheck
import React from 'react';
import { ActionMenu } from './components';
import { useProjectSalesColumns } from './hooks';
import {
  DataTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { TABLES } from '@/constants/tables';
import { useMemorizedColumnsWidths } from '@/hooks';
import { useProjectDetailContext } from '../ProjectDetailProvider';

/**
 * Porject sales datatable.
 * @returns
 */
function ProjectSalesTableRoot() {
  // Settings hook.
  const { projectSettings } = useProjectDetailContext();
  const salesTableSize = projectSettings?.tableSize;

  // Retrieve project sales table columns.
  const columns = useProjectSalesColumns();

  // Handle delete sale.
  const handleDeleteSale = () => {};

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.SALES);

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
      size={salesTableSize}
      payload={{
        onDelete: handleDeleteSale,
      }}
    />
  );
}
export const ProjectSalesTable = ProjectSalesTableRoot;
