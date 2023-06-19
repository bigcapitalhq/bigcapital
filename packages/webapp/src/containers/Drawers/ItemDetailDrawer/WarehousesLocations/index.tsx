// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { TableStyle } from '@/constants';
import { DataTable, TableSkeletonRows, Card } from '@/components';

import { useItemDetailDrawerContext } from '../ItemDetailDrawerProvider';
import { useWarehouseLocationsColumns } from './components';
import { useItemWarehouseLocation } from '@/hooks/query';

/**
 * Warehouses locations table columns.
 */
export default function WarehouseLocationsTable() {
  // Warehouses locations table columns.
  const columns = useWarehouseLocationsColumns();

  const { itemId } = useItemDetailDrawerContext();

  // Handle fetch Estimate associated transactions.
  const {
    isLoading: isItemWarehousesLoading,
    isFetching: isItemWarehousesFetching,
    data: itemWarehouses,
  } = useItemWarehouseLocation(itemId, { enabled: !!itemId });
  return (
    <WarehouseLocationsGLEntriesRoot>
      <DataTable
        columns={columns}
        data={itemWarehouses}
        headerLoading={isItemWarehousesLoading}
        progressBarLoading={isItemWarehousesFetching}
        TableLoadingRenderer={TableSkeletonRows}
        styleName={TableStyle.Constraint}
      />
    </WarehouseLocationsGLEntriesRoot>
  );
}

const WarehouseLocationsGLEntriesRoot = styled(Card)``;
