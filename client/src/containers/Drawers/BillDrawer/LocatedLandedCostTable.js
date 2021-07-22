import React from 'react';
import { DataTable } from 'components';
import { useLocatedLandedCostColumns, ActionsMenu } from './components';

/**
 * Located landed cost table.
 */
function LocatedLandedCostTable() {
  const columns = useLocatedLandedCostColumns();

  const DATA = [
    {
      name: 'INV-1000',
      amount: '10.000.000',
      allocation_method: 'Bill',
    },
  ];

  return <DataTable columns={columns} data={DATA} ContextMenu={ActionsMenu} />;
}

export default LocatedLandedCostTable;
