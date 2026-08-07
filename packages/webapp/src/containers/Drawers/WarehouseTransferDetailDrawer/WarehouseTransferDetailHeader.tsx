import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { WarehouseTransferDetailsStatus } from './utils';
import { useWarehouseDetailDrawerContext } from './WarehouseTransferDetailDrawerProvider';
import {
  CommercialDocHeader,
  CommercialDocTopHeader,
  Col,
  DetailItem,
  DetailsMenu,
  FormatDate,
  Row,
} from '@/components';

export function WarehouseTransferDetailHeader(): React.ReactElement {
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
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem label={intl.get('date')}>
              <FormatDate value={warehouseTransfer?.formattedDate} />
            </DetailItem>

            <DetailItem
              label={intl.get(
                'warehouse_transfer.drawer.label.transfer_number',
              )}
            >
              {defaultTo(warehouseTransfer?.transactionNumber, '-')}
            </DetailItem>
            <DetailItem
              label={intl.get('warehouse_transfer.drawer.label.from_warehouse')}
            >
              {warehouseTransfer?.fromWarehouse?.name}
            </DetailItem>
            <DetailItem
              label={intl.get('warehouse_transfer.drawer.label.to_warehouse')}
            >
              {warehouseTransfer?.toWarehouse?.name}
            </DetailItem>
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
