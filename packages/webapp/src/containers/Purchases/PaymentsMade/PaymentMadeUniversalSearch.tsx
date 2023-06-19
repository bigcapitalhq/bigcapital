// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { MenuItem } from '@blueprintjs/core';

import { Icon } from '@/components';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import { highlightText } from '@/utils';
import { AbilitySubject, PaymentMadeAction } from '@/constants/abilityOption';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

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
    openDrawer(DRAWERS.PAYMENT_MADE_DETAILS, { paymentMadeId: resourceId });
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
  { text, label, reference },
  { handleClick, modifiers, query },
) {
  return (
    <MenuItem
      active={modifiers.active}
      text={
        <div>
          <div>{highlightText(text, query)}</div>

          <span class="bp3-text-muted">
            {reference.payment_number && (
              <>
                {highlightText(reference.payment_number, query)}
                <Icon icon={'caret-right-16'} iconSize={16} />
              </>
            )}
            {highlightText(reference.formatted_payment_date, query)}
          </span>
        </div>
      }
      label={<div class="amount">{label}</div>}
      onClick={handleClick}
      className={'universal-search__item--payment-made'}
    />
  );
}

/**
 * Payment made resource item to search item.
 */
const paymentMadeToSearch = (payment) => ({
  id: payment.id,
  text: payment.vendor.display_name,
  label: payment.formatted_amount,
  reference: payment,
});

/**
 * Binds universal search payment made configure.
 */
export const universalSearchPaymentMadeBind = () => ({
  resourceType: RESOURCES_TYPES.PAYMENT_MADE,
  optionItemLabel: intl.get('payments_made'),
  selectItemAction: PaymentMadeUniversalSearchSelect,
  itemRenderer: PaymentMadeUniversalSearchItem,
  itemSelect: paymentMadeToSearch,
  permission: {
    ability: PaymentMadeAction.View,
    subject: AbilitySubject.PaymentMade,
  },
});
