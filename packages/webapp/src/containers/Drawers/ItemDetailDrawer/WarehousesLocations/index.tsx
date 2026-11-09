import React from 'react';
import styled from 'styled-components';
import { useItemDetailDrawerContext } from '../ItemDetailDrawerProvider';
import { useWarehouseLocationsColumns } from './components';
import { DataTable, TableSkeletonRows, Card } from '@/components';
import { TableStyle } from '@/constants';
import { useItemWarehouseLocation } from '@/hooks/query';

/**
 * Warehouses locations table columns.
 */
export function WarehouseLocationsTable() {
  const columns = useWarehouseLocationsColumns();
  const { itemId } = useItemDetailDrawerContext();
  const {
    isLoading: isItemWarehousesLoading,
    isFetching: isItemWarehousesFetching,
    data: itemWarehouses,
  } = useItemWarehouseLocation(itemId, { enabled: !!itemId });

  return (
    <WarehouseLocationsGLEntriesRoot>
      <DataTable
        columns={columns}
        data={itemWarehouses ?? []}
        headerLoading={isItemWarehousesLoading}
        progressBarLoading={isItemWarehousesFetching}
        TableLoadingRenderer={TableSkeletonRows}
        styleName={TableStyle.Constrant}
      />
    </WarehouseLocationsGLEntriesRoot>
  );
}

const WarehouseLocationsGLEntriesRoot = styled(Card)``;
