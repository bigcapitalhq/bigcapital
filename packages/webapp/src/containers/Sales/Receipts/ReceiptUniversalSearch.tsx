import { MenuItem, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { Icon, Choose, T, TextStatus } from '@/components';
import { AbilitySubject, SaleReceiptAction } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

interface ReceiptUniversalSearchSelectComponentProps
  extends WithDrawerActionsProps {
  resourceType: string;
  resourceId: number;
  onAction?: () => void;
}

/**
 * Receipt universal search item select action.
 */
function ReceiptUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,
  onAction,

  // #withDrawerActions
  openDrawer,
}: ReceiptUniversalSearchSelectComponentProps) {
  if (resourceType === RESOURCES_TYPES.RECEIPT) {
    openDrawer(DRAWERS.RECEIPT_DETAILS, { receiptId: resourceId });
    onAction && onAction();
  }
  return null;
}

export const ReceiptUniversalSearchSelect = withDrawerActions(
  ReceiptUniversalSearchSelectComponent,
);

/**
 * Status accessor.
 */
function ReceiptStatus({ receipt }: { receipt: any }) {
  return (
    <Choose>
      <Choose.When condition={receipt.isClosed}>
        <TextStatus intent={Intent.SUCCESS}>
          <T id={'closed'} />
        </TextStatus>
      </Choose.When>

      <Choose.Otherwise>
        <TextStatus intent={Intent.NONE}>
          <T id={'draft'} />
        </TextStatus>
      </Choose.Otherwise>
    </Choose>
  );
}

interface ReceiptUniversalSearchItemProps {
  handleClick: () => void;
  modifiers: any;
  query: string;
}

/**
 * Receipt universal search item.
 */
export function ReceiptUniversalSearchItem(
  item: any,
  { handleClick, modifiers }: ReceiptUniversalSearchItemProps,
) {
  return (
    <MenuItem
      active={modifiers.active}
      text={
        <div>
          <div>{item.text}</div>
          <span className="bp4-text-muted">
            {item.reference.receiptNumber}{' '}
            <Icon icon={'caret-right-16'} iconSize={16} />
            {item.reference.formattedReceiptDate}
          </span>
        </div>
      }
      labelElement={
        <>
          <div className="amount">{item.reference.formattedAmount}</div>
          <ReceiptStatus receipt={item.reference} />
        </>
      }
      onClick={handleClick}
      className={'universal-search__item--receipt'}
    />
  );
}

/**
 * Transformes receipt resource item to search item.
 */
const transformReceiptsToSearch = (receipt: any) => ({
  id: receipt.id,
  text: receipt.customer?.displayName ?? '',
  label: receipt.formattedAmount ?? '',
  reference: receipt,
});

/**
 * Receipt universal search bind configuration.
 */
export const universalSearchReceiptBind = () => ({
  resourceType: RESOURCES_TYPES.RECEIPT,
  optionItemLabel: intl.get('receipts'),
  selectItemAction: ReceiptUniversalSearchSelect,
  itemRenderer: ReceiptUniversalSearchItem,
  itemSelect: transformReceiptsToSearch,
  permission: {
    ability: SaleReceiptAction.View,
    subject: AbilitySubject.Receipt,
  },
});
