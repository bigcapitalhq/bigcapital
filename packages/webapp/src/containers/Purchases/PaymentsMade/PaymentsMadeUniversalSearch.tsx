// @ts-nocheck
import { MenuItem } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { Icon } from '@/components';
import { AbilitySubject, PaymentMadeAction } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { highlightText } from '@/utils';

/**
 * Universal search bill item select action.
 */
function PaymentsMadeUniversalSearchSelectComponent({
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

export const PaymentsMadeUniversalSearchSelect = withDrawerActions(
  PaymentsMadeUniversalSearchSelectComponent,
);

/**
 * Payment made universal search item.
 */
export function PaymentsMadeUniversalSearchItem(
  { text, label, reference },
  { handleClick, modifiers, query },
) {
  return (
    <MenuItem
      active={modifiers.active}
      text={
        <div>
          <div>{highlightText(text, query)}</div>

          <span class="bp4-text-muted">
            {reference.paymentNumber && (
              <>
                {highlightText(reference.paymentNumber, query)}
                <Icon icon={'caret-right-16'} iconSize={16} />
              </>
            )}
            {highlightText(reference.formattedPaymentDate, query)}
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
  text: payment.vendor?.displayName ?? '',
  label: payment.formattedAmount ?? '',
  reference: payment,
});

/**
 * Binds universal search payment made configure.
 */
export const universalSearchPaymentMadeBind = () => ({
  resourceType: RESOURCES_TYPES.PAYMENT_MADE,
  optionItemLabel: intl.get('payments_made'),
  selectItemAction: PaymentsMadeUniversalSearchSelect,
  itemRenderer: PaymentsMadeUniversalSearchItem,
  itemSelect: paymentMadeToSearch,
  permission: {
    ability: PaymentMadeAction.View,
    subject: AbilitySubject.PaymentMade,
  },
});
