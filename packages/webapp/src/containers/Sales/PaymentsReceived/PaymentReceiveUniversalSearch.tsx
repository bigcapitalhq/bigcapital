import { MenuItem } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { Icon } from '@/components';
import {
  AbilitySubject,
  PaymentReceiveAction,
} from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import { highlightText } from '@/utils';

interface PaymentReceiveUniversalSearchSelectProps
  extends WithDrawerActionsProps {
  resourceType: string;
  resourceId: number;
}

/**
 * Payment receive universal search item select action.
 */
function PaymentReceiveUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,

  // #withDrawerActions
  openDrawer,
}: PaymentReceiveUniversalSearchSelectProps) {
  if (resourceType === RESOURCES_TYPES.PAYMENT_RECEIVE) {
    openDrawer(DRAWERS.PAYMENT_RECEIVED_DETAILS, {
      paymentReceiveId: resourceId,
    });
  }
  return null;
}

export const PaymentReceiveUniversalSearchSelect = withDrawerActions(
  PaymentReceiveUniversalSearchSelectComponent,
);

interface PaymentReceiveUniversalSearchItemData {
  id: number;
  text: string;
  label: string;
  reference: {
    paymentReceiveNo: string;
    formattedPaymentDate: string;
    formattedAmount: string;
  };
}

interface PaymentReceiveUniversalSearchItemActions {
  handleClick: () => void;
  modifiers: { active: boolean };
  query: string;
}

/**
 * Payment receive universal search item.
 */
export function PaymentReceiveUniversalSearchItem(
  item: PaymentReceiveUniversalSearchItemData,
  { handleClick, modifiers, query }: PaymentReceiveUniversalSearchItemActions,
) {
  return (
    <MenuItem
      active={modifiers.active}
      text={
        <div>
          <div>{highlightText(item.text, query)}</div>

          <span className="bp4-text-muted">
            {highlightText(item.reference.paymentReceiveNo, query)}{' '}
            <Icon icon={'caret-right-16'} iconSize={16} />
            {highlightText(item.reference.formattedPaymentDate, query)}
          </span>
        </div>
      }
      labelElement={
        <div className="amount">{item.reference.formattedAmount}</div>
      }
      onClick={handleClick}
      className={'universal-search__item--invoice'}
    />
  );
}

/**
 * Transformes payment receives to search.
 */
const paymentReceivesToSearch = (payment: {
  id: number;
  customer?: { displayName?: string };
  formattedPaymentDate?: string;
  formattedAmount?: string;
}) => ({
  id: payment.id,
  text: payment.customer?.displayName ?? '',
  subText: payment.formattedPaymentDate ?? '',
  label: payment.formattedAmount ?? '',
  reference: payment,
});

/**
 * Binds universal search payment receive configure.
 */
export const universalSearchPaymentReceiveBind = () => ({
  resourceType: RESOURCES_TYPES.PAYMENT_RECEIVE,
  optionItemLabel: intl.get('payment_received'),
  selectItemAction: PaymentReceiveUniversalSearchSelect,
  itemRenderer: PaymentReceiveUniversalSearchItem,
  itemSelect: paymentReceivesToSearch,
  permission: {
    ability: PaymentReceiveAction.View,
    subject: AbilitySubject.PaymentReceive,
  },
});
