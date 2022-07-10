//@ts-nocheck
import React from 'react';
import { DataTable } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';
import { TABLES } from 'common/tables';
import { useMemorizedColumnsWidths } from 'hooks';
import { ActionMenu } from './components';
import { useProjectSalesColumns } from './hooks';
import withSettings from '../../../../Settings/withSettings';

import { compose } from 'utils';

/**
 * Porject sales datatable.
 * @returns
 */
function ProjectSalesTableRoot({
  // #withSettings
  salesTableSize,
}) {
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
export const ProjectSalesTable = compose(
  withSettings(({ salesSettings }) => ({
    salesTableSize: salesSettings?.tableSize,
  })),
)(ProjectSalesTableRoot);
