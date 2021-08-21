import React from 'react';
import { MenuItem } from '@blueprintjs/core';
import intl from 'react-intl-universal';

import { Icon } from 'components';

import { RESOURCES_TYPES } from 'common/resourcesTypes';
import withDrawerActions from '../../Drawer/withDrawerActions';

import { highlightText } from 'utils';

/**
 * Universal search bill item select action.
 */
function PaymentMadeUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,

  // #withDrawerActions
  openDrawer,
}) {
  if (resourceType === RESOURCES_TYPES.PAYMENT_MADE) {
    openDrawer('payment-made-detail-drawer', { paymentMadeId: resourceId });
  }
  return null;
}

export const PaymentMadeUniversalSearchSelect = withDrawerActions(
  PaymentMadeUniversalSearchSelectComponent,
);

/**
 * Payment made universal search item.
 */
 export function PaymentMadeUniversalSearchItem(
  item,
  { handleClick, modifiers, query },
) {
  return (
    <MenuItem
      active={modifiers.active}
      text={
        <div>
          <div>{highlightText(item.text, query)}</div>

          <span class="bp3-text-muted">
            {highlightText(item.reference.payment_number, query)}{' '}
            <Icon icon={'caret-right-16'} iconSize={16} />
            {highlightText(item.reference.formatted_payment_date, query)}
          </span>
        </div>
      }
      label={<div class="amount">{item.reference.formatted_amount}</div>}
      onClick={handleClick}
      className={'universal-search__item--payment-made'}
    />
  );
}

/**
 * Payment made resource item to search item.
 */
const paymentMadeToSearch = (payment) => ({
  text: payment.vendor.display_name,
  subText: payment.formatted_payment_date,
  label: payment.formatted_amount,
  reference: payment,
});

/**
 * Binds universal search payment made configure.
 */
 export const universalSearchPaymentMadeBind = () => ({
  resourceType: RESOURCES_TYPES.PAYMENT_MADE,
  optionItemLabel: intl.get('payment_mades'),
  selectItemAction: PaymentMadeUniversalSearchSelect,
  itemRenderer: PaymentMadeUniversalSearchItem,
  itemSelect: paymentMadeToSearch,
});
