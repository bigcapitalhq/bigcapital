import React from 'react';
import styled from 'styled-components';

import { CLASSES } from 'common/classes';
import { TableStyle } from '../../common';
import { DataTableEditable, DataTable } from 'components';
import { compose, saveInvoke, updateTableCell } from 'utils';
import { useWarehouseEntriesColumns } from './components';

export default function IntegrateWarehousesTable({
  // #ownProps
  initialWarehouse,
  selectedWarehouseId,
  onUpdateData,
  entries,
  errors,
}) {
  const [rows, setRows] = React.useState(initialWarehouse);

  // warehouses entries columns.
  const columns = useWarehouseEntriesColumns();

  // Handle update data.
  const handleUpdateData = React.useCallback(
    (rowIndex, columnId, value) => {
      const newRows = compose(updateTableCell(rowIndex, columnId, value))(
        entries,
      );
      onUpdateData(newRows);
    },
    [onUpdateData, entries],
  );

  const DATA = [
    {
      warehouse_name: true,
      quantity: '9,444',
      availiable_for_sale: 0,
    },
    {
      warehouse_name: false,
      quantity: '19,444',
      availiable_for_sale: 0,
    },
  ];

  return (
    <WarehouseDataTableRoot
      columns={columns}
      data={DATA}
      payload={{
        errors: errors || [],
        updateData: handleUpdateData,
      }}
    />
  );
}

const WarehouseDataTableRoot = styled(DataTable)`
  width: 600px;

  .table {
    border: 1px solid #000000;
    .thead .th {
      background: transparent;
      color: #222222;
      border-bottom: 1px solid #000000;
      padding: 0.5rem;
    }
    .tbody .tr .td {
      padding: 0.2rem 0.2rem;
      border-bottom: 1px solid #cecbcb;
    }
  }
`;
