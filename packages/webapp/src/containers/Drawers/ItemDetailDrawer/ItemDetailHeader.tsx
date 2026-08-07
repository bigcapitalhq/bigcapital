import classNames from 'classnames';
import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { useItemDetailDrawerContext } from './ItemDetailDrawerProvider';
import { If, DetailsMenu, DetailItem, Card } from '@/components';

/**
 * Item header drawer of readonly details.
 */
export function ItemDetailHeader() {
  const { item } = useItemDetailDrawerContext();

  return (
    <Card>
      <div className="item-drawer__content">
        <DetailsMenu direction={'vertical'}>
          <DetailItem
            name={'name'}
            label={intl.get('item_name')}
            children={item?.name}
          />
          <DetailItem
            label={intl.get('sell_price')}
            children={item?.sellPriceFormatted}
            align={'right'}
          />
          <DetailItem
            label={intl.get('cost_price')}
            children={item?.costPriceFormatted}
            align={'right'}
          />
        </DetailsMenu>

        <DetailsMenu direction={'horizantal'}>
          <DetailItem
            label={intl.get('item_type')}
            children={item?.typeFormatted}
          />
          <DetailItem
            label={intl.get('item_code')}
            children={defaultTo(item?.code, '-')}
          />
          <If condition={item?.type === 'inventory'}>
            <DetailItem name={'quantity'} label={intl.get('quantity_on_hand')}>
              <span
                className={classNames({
                  mines: (item?.quantityOnHand ?? 0) <= 0,
                  plus: (item?.quantityOnHand ?? 0) > 0,
                })}
              >
                {defaultTo(item?.quantityOnHand, '-')}
              </span>
            </DetailItem>
          </If>
          <DetailItem
            label={intl.get('category_name')}
            children={defaultTo(item?.category?.name, '-')}
          />
          <DetailItem
            label={intl.get('sell_account_id')}
            children={defaultTo(item?.sellAccount?.name, '-')}
          />
          <DetailItem
            label={intl.get('cost_account_id')}
            children={defaultTo(item?.costAccount?.name, '-')}
          />
          <DetailItem
            label={intl.get('item.details.sell_tax_rate')}
            children={item?.sellTaxRate?.name}
          />
          <DetailItem
            label={intl.get('item.details.purchase_tax_rate')}
            children={item?.purchaseTaxRate?.name}
          />
          <If condition={item?.type === 'inventory'}>
            <DetailItem
              label={intl.get('inventory_account')}
              children={defaultTo(item?.inventoryAccount?.name, '-')}
            />
          </If>
          <DetailItem
            label={intl.get('item.sell_description')}
            children={defaultTo(item?.sellDescription, '-')}
          />
          <DetailItem
            label={intl.get('item.purchase_description')}
            children={defaultTo(item?.purchaseDescription, '-')}
          />
        </DetailsMenu>
      </div>
    </Card>
  );
}
