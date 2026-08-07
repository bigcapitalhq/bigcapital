import React from 'react';
import { WarehouseTransferDetailHeader } from './WarehouseTransferDetailHeader';
import { WarehouseTransferDetailTable } from './WarehouseTransferDetailTable';
import { CommercialDocBox } from '@/components';

export function WarehouseTransferDetailPanel(): React.ReactElement {
  return (
    <CommercialDocBox>
      <WarehouseTransferDetailHeader />
      <WarehouseTransferDetailTable />
    </CommercialDocBox>
  );
}
