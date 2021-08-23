import React from 'react';
import intl from 'react-intl-universal';

import { DetailItem } from '../../../components/Details';

export default function ItemDetailList({
  item: {
    name,
    code,
    type,
    category,
    sell_price_formatted,
    cost_price_formatted,
    cost_account,
    sell_account,
  },
}) {
  return (
    <div className="details-menu">
      <div className="details-menu--vertical">
        <DetailItem label={intl.get('item_name')} children={name} />
        <DetailItem label={intl.get('item_code')} children={code} />
        <DetailItem
          label={intl.get('sell_price')}
          children={sell_price_formatted}
        />
        <DetailItem
          label={intl.get('cost_price')}
          children={cost_price_formatted}
        />
      </div>
      <div className="details-menu--horizontal">
        <DetailItem label={intl.get('item_type')} children={type} />
        <DetailItem
          label={intl.get('category_name')}
          children={category?.name ? category?.name : '--'}
        />
        <DetailItem
          label={intl.get('cost_account_id')}
          children={cost_account?.name}
        />
        <DetailItem
          label={intl.get('sell_account_id')}
          children={sell_account?.name}
        />
      </div>
    </div>
  );
}
