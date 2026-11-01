import { MenuItem } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { BillPayment } from '@bigcapital/sdk-ts';
import { Icon } from '@/components';
import { AbilitySubject, PaymentMadeAction } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import { highlightText } from '@/utils';

interface PaymentsMadeUniversalSearchSelectProps
  extends WithDrawerActionsProps {
  resourceType: string;
  resourceId: number;
}

/**
 * Universal search bill item select action.
 */
function PaymentsMadeUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,

  // #withDrawerActions
  openDrawer,
}: PaymentsMadeUniversalSearchSelectProps) {
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
interface PaymentsMadeUniversalSearchItemData {
  id: number;
  text: string;
  label: string;
  reference: BillPayment;
}

interface PaymentsMadeUniversalSearchItemActions {
  handleClick: () => void;
  modifiers: { active: boolean };
  query: string;
}

export function PaymentsMadeUniversalSearchItem(
  { text, label, reference }: PaymentsMadeUniversalSearchItemData,
  { handleClick, modifiers, query }: PaymentsMadeUniversalSearchItemActions,
) {
  return (
    <MenuItem
      active={modifiers.active}
      text={
        <div>
          <div>{highlightText(text, query)}</div>

          <span className="bp4-text-muted">
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
      labelElement={<div className="amount">{label}</div>}
      onClick={handleClick}
      className={'universal-search__item--payment-made'}
    />
  );
}

/**
 * Payment made resource item to search item.
 */
const paymentMadeToSearch = (payment: BillPayment) => ({
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
