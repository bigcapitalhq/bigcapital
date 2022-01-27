import React from 'react';
import styled from 'styled-components';

import { DataTable, CommercialDocEntriesTable, Card } from 'components';

import { useWarehouseLocationsColumns } from './components';

import { TableStyle } from '../../../../common';

/**
 * Warehouses locations table columns.
 */
export default function WarehouseLocationsTable() {
  // Warehouses locations table columns.
  const columns = useWarehouseLocationsColumns();

  return (
    <WarehouseLocationsGLEntriesRoot>
      <DataTable columns={columns} data={[]} styleName={TableStyle.Constrant} />
    </WarehouseLocationsGLEntriesRoot>
  );
}

const WarehouseLocationsGLEntriesRoot = styled(Card)``;
