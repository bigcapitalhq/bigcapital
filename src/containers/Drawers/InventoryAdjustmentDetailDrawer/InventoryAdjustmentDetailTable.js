import React from 'react';
import clsx from 'classnames';

import { DataTable } from 'components';

import { useInventoryAdjustmentEntriesColumns } from './utils';
import { useInventoryAdjustmentDrawerContext } from './InventoryAdjustmentDrawerProvider';

import InventoryAdjustmentDrawerCls from 'style/components/Drawers/InventoryAdjustmentDrawer.module.scss';

/**
 * Inventory adjustment detail entries table.
 */
export default function InventoryAdjustmentDetailTable() {
  const columns = useInventoryAdjustmentEntriesColumns();

  const {
    inventoryAdjustment: { entries },
  } = useInventoryAdjustmentDrawerContext();

  return (
    <div className={clsx(InventoryAdjustmentDrawerCls.detail_panel_table)}>
      <DataTable
        columns={columns}
        data={entries}
        className={'table-constrant'}
      />
    </div>
  );
}
