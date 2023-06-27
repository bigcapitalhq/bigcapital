// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { defaultTo } from 'lodash';

import { If, DetailsMenu, DetailItem, Card } from '@/components';
import { useItemDetailDrawerContext } from './ItemDetailDrawerProvider';

/**
 * Item header drawer of readonly details.
 */
export default function ItemDetailHeader() {
  const { item } = useItemDetailDrawerContext();

  return (
    <Card>
      <div class="item-drawer__content">
        <DetailsMenu direction={'vertical'}>
          <DetailItem
            name={'name'}
            label={intl.get('item_name')}
            children={item.name}
          />
          <DetailItem
            label={intl.get('sell_price')}
            children={item.sell_price_formatted}
            align={'right'}
          />
          <DetailItem
            label={intl.get('cost_price')}
            children={item.cost_price_formatted}
            align={'right'}
          />
        </DetailsMenu>

        <DetailsMenu direction={'horizontal'}>
          <DetailItem
            label={intl.get('item_type')}
            children={item.type_formatted}
          />
          <DetailItem
            label={intl.get('item_code')}
            children={defaultTo(item.code, '-')}
          />
          <If condition={item.type === 'inventory'}>
            <DetailItem name={'quantity'} label={intl.get('quantity_on_hand')}>
              <span
                className={classNames({
                  mines: item.quantity_on_hand <= 0,
                  plus: item.quantity_on_hand > 0,
                })}
              >
                {defaultTo(item.quantity_on_hand, '-')}
              </span>
            </DetailItem>
          </If>
          <DetailItem
            label={intl.get('category_name')}
            children={defaultTo(item.category?.name, '-')}
          />
          <DetailItem
            label={intl.get('sell_account_id')}
            children={defaultTo(item?.sell_account?.name, '-')}
          />
          <DetailItem
            label={intl.get('cost_account_id')}
            children={defaultTo(item.cost_account?.name, '-')}
          />
          <If condition={item.type === 'inventory'}>
            <DetailItem
              label={intl.get('inventory_account')}
              children={defaultTo(item?.inventory_account?.name, '-')}
            />
          </If>
          <DetailItem
            label={intl.get('item.sell_description')}
            children={defaultTo(item.sell_description, '-')}
          />
          <DetailItem
            label={intl.get('item.purchase_description')}
            children={defaultTo(item.purchase_description, '-')}
          />
        </DetailsMenu>
      </div>
    </Card>
  );
}
