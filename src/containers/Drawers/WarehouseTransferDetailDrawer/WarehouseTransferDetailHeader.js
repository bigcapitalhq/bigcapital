import React from 'react';
import intl from 'react-intl-universal';
import { defaultTo } from 'lodash';
import styled from 'styled-components';

import {
  FormatDate,
  T,
  Row,
  Col,
  DetailsMenu,
  DetailItem,
  CommercialDocHeader,
  CommercialDocTopHeader,
} from 'components';
import { useWarehouseDetailDrawerContext } from './WarehouseTransferDetailDrawerProvider';

/**
 * Warehouse transfer details drawer header.
 */
export default function WarehouseTransferDetailHeader() {
  const { warehouseTransfer } = useWarehouseDetailDrawerContext();

  return (
    <CommercialDocHeader>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <DetailItem label={intl.get('date')}>
          <FormatDate value={warehouseTransfer.formatted_date} />
        </DetailItem>

        <DetailItem
          label={intl.get('warehouse_transfer.drawer.label.transfer_number')}
          children={defaultTo(warehouseTransfer.transaction_number, '-')}
        />
        <DetailItem
          label={intl.get('warehouse_transfer.drawer.label.from_warehouse')}
          children={warehouseTransfer.from_warehouse.name}
        />
        <DetailItem
          label={intl.get('warehouse_transfer.drawer.label.to_warehouse')}
          children={warehouseTransfer.to_warehouse.name}
        />
      </DetailsMenu>
    </CommercialDocHeader>
  );
}
