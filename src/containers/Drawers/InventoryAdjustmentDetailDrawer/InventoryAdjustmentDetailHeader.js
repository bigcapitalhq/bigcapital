import React from 'react';
import moment from 'moment';

import intl from 'react-intl-universal';
import { defaultTo } from 'lodash';
import clsx from 'classnames';

import { DetailsMenu, DetailItem } from 'components';
import { useInventoryAdjustmentDrawerContext } from './InventoryAdjustmentDrawerProvider';

import InventoryAdjustmentDrawerCls from 'style/components/Drawers/InventoryAdjustmentDrawer.module.scss';

/**
 * Inventory detail header.
 */
export default function InventoryAdjustmentDetailHeader() {
  const { inventoryAdjustment } = useInventoryAdjustmentDrawerContext();

  return (
    <div className={clsx(InventoryAdjustmentDrawerCls.detail_panel_header)}>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <DetailItem label={intl.get('date')}>
          {moment(inventoryAdjustment.date).format('YYYY MMM DD')}
        </DetailItem>

        <DetailItem label={intl.get('type')}>
          {inventoryAdjustment.type}
        </DetailItem>

        <DetailItem label={intl.get('adjustment_account')}>
          {inventoryAdjustment.adjustment_account.name}
        </DetailItem>

        <DetailItem name={'reference'} label={intl.get('reference_no')}>
          {defaultTo(inventoryAdjustment.reference_no, '-')}
        </DetailItem>

        <DetailItem label={intl.get('published_at')}>
          {moment(inventoryAdjustment.published_at).format('YYYY MMM DD')}
        </DetailItem>

        <DetailItem label={intl.get('reason')}>
          {defaultTo(inventoryAdjustment.reason, '—')}
        </DetailItem>

        <DetailItem label={intl.get('created_at')}>
          {moment(inventoryAdjustment.created_at).format('YYYY MMM DD')}
        </DetailItem>
      </DetailsMenu>
    </div>
  );
}
