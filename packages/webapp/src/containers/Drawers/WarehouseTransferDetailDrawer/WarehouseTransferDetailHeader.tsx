// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { defaultTo } from 'lodash';

import {
  FormatDate,
  Row,
  Col,
  DetailsMenu,
  DetailItem,
  CommercialDocHeader,
  CommercialDocTopHeader,
} from '@/components';
import { WarehouseTransferDetailsStatus } from './utils';
import { useWarehouseDetailDrawerContext } from './WarehouseTransferDetailDrawerProvider';

/**
 * Warehouse transfer details drawer header.
 */
export default function WarehouseTransferDetailHeader() {
  const { warehouseTransfer } = useWarehouseDetailDrawerContext();

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <StatusDetailItem>
            <WarehouseTransferDetailsStatus
              warehouseTransfer={warehouseTransfer}
            />
          </StatusDetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>
      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizontal'} minLabelSize={'180px'}>
            <DetailItem label={intl.get('date')}>
              <FormatDate value={warehouseTransfer.formatted_date} />
            </DetailItem>

            <DetailItem
              label={intl.get(
                'warehouse_transfer.drawer.label.transfer_number',
              )}
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
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}

const StatusDetailItem = styled(DetailItem)`
  width: 50%;
  text-align: right;
  position: relative;
  top: -5px;
`;
