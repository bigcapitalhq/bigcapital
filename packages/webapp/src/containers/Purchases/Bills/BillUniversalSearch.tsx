// @ts-nocheck
import { MenuItem, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { T, Icon, Choose, If, TextStatus } from '@/components';
import { AbilitySubject, BillAction } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { formattedAmount } from '@/utils';

/**
 * Universal search bill item select action.
 */
function BillUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,
  onAction,

  // #withDrawerActions
  openDrawer,
}) {
  if (resourceType === RESOURCES_TYPES.BILL) {
    openDrawer(DRAWERS.BILL_DETAILS, { billId: resourceId });
    onAction && onAction();
  }
  return null;
}

export const BillUniversalSearchSelect = withDrawerActions(
  BillUniversalSearchSelectComponent,
);

/**
 * Status accessor.
 */
export function BillStatus({ bill }) {
  return (
    <Choose>
      <Choose.When condition={bill.isFullyPaid && bill.isOpen}>
        <TextStatus intent={Intent.SUCCESS}>
          <T id={'paid'} />
        </TextStatus>
      </Choose.When>
      <Choose.When condition={bill.isOpen}>
        <Choose>
          <Choose.When condition={bill.isOverdue}>
            <TextStatus intent={Intent.DANGER}>
              {intl.get('overdue_by', { overdue: bill.overdueDays })}
            </TextStatus>
          </Choose.When>
          <Choose.Otherwise>
            <TextStatus intent={Intent.WARNING}>
              {intl.get('due_in', { due: bill.remainingDays })}
            </TextStatus>
          </Choose.Otherwise>
        </Choose>
        <If condition={bill.isPartiallyPaid}>
          <TextStatus intent={Intent.WARNING}>
            {intl.get('day_partially_paid', {
              due: formattedAmount(bill.dueAmount, bill.currencyCode),
            })}
          </TextStatus>
        </If>
      </Choose.When>
      <Choose.Otherwise>
        <TextStatus intent={Intent.NONE}>
          <T id={'draft'} />
        </TextStatus>
      </Choose.Otherwise>
    </Choose>
  );
}

/**
 * Bill universal search item.
 */
export function BillUniversalSearchItem(
  item,
  { handleClick, modifiers, query },
) {
  return (
    <MenuItem
      active={modifiers.active}
      text={
        <div>
          <div>{item.text}</div>
          <span class="bp4-text-muted">
            {item.reference.billNumber}{' '}
            <Icon icon={'caret-right-16'} iconSize={16} />
            {item.reference.formattedBillDate}
          </span>
        </div>
      }
      label={
        <>
          <div class="amount">{item.reference.formattedAmount}</div>
          <BillStatus bill={item.reference} />
        </>
      }
      onClick={handleClick}
      className={'universal-search__item--bill'}
    />
  );
}

const billsToSearch = (bill) => ({
  id: bill.id,
  text: bill.vendor?.displayName ?? '',
  reference: bill,
});

export const universalSearchBillBind = () => ({
  resourceType: RESOURCES_TYPES.BILL,
  optionItemLabel: intl.get('bills'),
  selectItemAction: BillUniversalSearchSelect,
  itemRenderer: BillUniversalSearchItem,
  itemSelect: billsToSearch,
  permission: {
    ability: BillAction.View,
    subject: AbilitySubject.Bill,
  },
});
