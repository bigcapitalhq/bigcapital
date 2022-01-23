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
 * Warehouse transfer details drawer header
 */
export default function WarehouseTransferDetailHeader() {
  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <AmountItem label={intl.get('amount')}>
            <span class="big-number">'$10'</span>
          </AmountItem>
        </DetailsMenu>
      </CommercialDocTopHeader>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <DetailItem label={intl.get('date')}>
          {/* <FormatDate value={} /> */}
        </DetailItem>

        <DetailItem
          label={intl.get('warehouse_transfer.drawer.label.transfer_number')}
          // children={}
        />
        <DetailItem
          label={intl.get('warehouse_transfer.drawer.label.from_warehouse')}
          // children={}
        />
        <DetailItem
          label={intl.get('warehouse_transfer.drawer.label.to_warehouse')}
          // children={}
        />
        <DetailItem
          label={intl.get('reason')}
          // children={defaultTo(, '-')}
        />
      </DetailsMenu>
    </CommercialDocHeader>
  );
}

const AmountItem = styled(DetailItem)`
  width: 50%;
`;
