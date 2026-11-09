import clsx from 'classnames';
import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { useInventoryAdjustmentDrawerContext } from './InventoryAdjustmentDrawerProvider';
import { DetailsMenu, DetailItem, FormatDate } from '@/components';
import InventoryAdjustmentDrawerCls from '@/style/components/Drawers/InventoryAdjustmentDrawer.module.scss';

/**
 * Inventory detail header.
 */
export function InventoryAdjustmentDetailHeader() {
  const { inventoryAdjustment } = useInventoryAdjustmentDrawerContext();

  return (
    <div className={clsx(InventoryAdjustmentDrawerCls.detail_panel_header)}>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <DetailItem label={intl.get('date')}>
          <FormatDate value={inventoryAdjustment?.date} />
        </DetailItem>

        <DetailItem label={intl.get('type')}>
          {inventoryAdjustment?.formattedType}
        </DetailItem>

        <DetailItem label={intl.get('adjustment_account')}>
          {inventoryAdjustment?.adjustmentAccount?.name}
        </DetailItem>

        <DetailItem name={'reference'} label={intl.get('reference_no')}>
          {defaultTo(inventoryAdjustment?.referenceNo, '-')}
        </DetailItem>

        <DetailItem label={intl.get('published_at')}>
          <FormatDate value={inventoryAdjustment?.publishedAt} />
        </DetailItem>

        <DetailItem label={intl.get('reason')}>
          {defaultTo(inventoryAdjustment?.reason, '—')}
        </DetailItem>

        <DetailItem label={intl.get('created_at')}>
          <FormatDate value={inventoryAdjustment?.createdAt} />
        </DetailItem>
      </DetailsMenu>
    </div>
  );
}
