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
  const {
    inventoryAdjustment: {
      date,
      type,
      adjustment_account,
      inventory_direction,
      description,
      reference_no,
      reason,
      published_at,
      created_at,
    },
  } = useInventoryAdjustmentDrawerContext();

  return (
    <div className={clsx(InventoryAdjustmentDrawerCls.detail_panel_header)}>
      <DetailsMenu>
        <DetailItem label={intl.get('date')}>
          {moment(date).format('YYYY MMM DD')}
        </DetailItem>
        <DetailItem label={intl.get('type')}>{type}</DetailItem>
        <DetailItem label={intl.get('adjustment_account')}>
          {adjustment_account.name}
        </DetailItem>
        <DetailItem name={'reference'} label={intl.get('reference_no')}>
          {defaultTo(reference_no, '-')}
        </DetailItem>
        <DetailItem label={intl.get('published_at')}>
          {moment(published_at).format('YYYY MMM DD')}
        </DetailItem>
      </DetailsMenu>
      <DetailsMenu direction={'horizantal'}>
        <DetailItem label={intl.get('reason')}>
          {defaultTo(reason, '—')}
        </DetailItem>
        <DetailItem label={intl.get('description')}>
          {defaultTo(description, '—')}
        </DetailItem>
        <DetailItem label={intl.get('created_at')}>
          {moment(created_at).format('YYYY MMM DD')}
        </DetailItem>
      </DetailsMenu>
    </div>
  );
}
