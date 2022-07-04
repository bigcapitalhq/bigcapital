import React from 'react';
import { MenuItem } from '@blueprintjs/core';
import intl from 'react-intl-universal';

import { RESOURCES_TYPES } from '../../../common/resourcesTypes';
import withDrawerActions from '../../Drawer/withDrawerActions';
import { highlightText } from 'utils';
import { Icon } from '@/components';
import {
  AbilitySubject,
  PaymentReceiveAction,
} from '../../../common/abilityOption';

/**
 * Payment receive universal search item select action.
 */
function PaymentReceiveUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,

  // #withDrawerActions
  openDrawer,
}) {
  if (resourceType === RESOURCES_TYPES.PAYMENT_RECEIVE) {
    openDrawer('payment-receive-detail-drawer', {
      paymentReceiveId: resourceId,
    });
  }
  return null;
}

export const PaymentReceiveUniversalSearchSelect = withDrawerActions(
  PaymentReceiveUniversalSearchSelectComponent,
);

/**
 * Payment receive universal search item.
 */
export function PaymentReceiveUniversalSearchItem(
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
            {highlightText(item.reference.payment_receive_no, query)}{' '}
            <Icon icon={'caret-right-16'} iconSize={16} />
            {highlightText(item.reference.formatted_payment_date, query)}
          </span>
        </div>
      }
      label={<div class="amount">{item.reference.formatted_amount}</div>}
      onClick={handleClick}
      className={'universal-search__item--invoice'}
    />
  );
}

/**
 * Transformes payment receives to search.
 */
const paymentReceivesToSearch = (payment) => ({
  id: payment.id,
  text: payment.customer.display_name,
  subText: payment.formatted_payment_date,
  label: payment.formatted_amount,
  reference: payment,
});

/**
 * Binds universal search payment receive configure.
 */
export const universalSearchPaymentReceiveBind = () => ({
  resourceType: RESOURCES_TYPES.PAYMENT_RECEIVE,
  optionItemLabel: intl.get('payment_receives'),
  selectItemAction: PaymentReceiveUniversalSearchSelect,
  itemRenderer: PaymentReceiveUniversalSearchItem,
  itemSelect: paymentReceivesToSearch,
  permission: {
    ability: PaymentReceiveAction.View,
    subject: AbilitySubject.PaymentReceive,
  },
});
