import { MenuItem, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { VendorCredit } from '@bigcapital/sdk-ts';
import { TextStatus, Icon, Choose, T } from '@/components';
import { AbilitySubject, VendorCreditAction } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';

interface VendorCreditUniversalSearchSelectComponentProps
  extends WithDrawerActionsProps {
  resourceType: string;
  resourceId: number;
  onAction?: () => void;
}

/**
 * Vendor credit universal search item select action.
 */
function VendorCreditUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,
  onAction,

  // #withDrawerActions
  openDrawer,
}: VendorCreditUniversalSearchSelectComponentProps) {
  if (resourceType === RESOURCES_TYPES.VENDOR_CREDIT) {
    openDrawer(DRAWERS.VENDOR_CREDIT_DETAILS, {
      vendorCreditId: resourceId,
    });
    onAction && onAction();
  }
  return null;
}

export const VendorCreditUniversalSearchSelect = withDrawerActions(
  VendorCreditUniversalSearchSelectComponent,
);

/**
 * Status accessor.
 */
interface VendorCreditUniversalSearchStatusProps {
  receipt: VendorCredit;
}

function VendorCreditUniversalSearchStatus({
  receipt,
}: VendorCreditUniversalSearchStatusProps) {
  return (
    <Choose>
      <Choose.When condition={receipt.isClosed}>
        <TextStatus intent={Intent.SUCCESS}>
          <T id={'closed'} />
        </TextStatus>
      </Choose.When>

      <Choose.When condition={receipt.isOpen}>
        <TextStatus intent={Intent.WARNING}>
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

/**
 * Credit note universal search item.
 */
interface VendorCreditUniversalSearchItemData {
  id: number;
  text: string;
  label: string;
  reference: VendorCredit;
}

interface VendorCreditUniversalSearchItemActions {
  handleClick: () => void;
  modifiers: { active: boolean };
  query: string;
}

export function VendorCreditUniversalSearchItem(
  item: VendorCreditUniversalSearchItemData,
  { handleClick, modifiers, query }: VendorCreditUniversalSearchItemActions,
) {
  return (
    <MenuItem
      active={modifiers.active}
      text={
        <div>
          <div>{item.text}</div>
          <span className="bp4-text-muted">
            {item.reference.vendorCreditNumber}{' '}
            <Icon icon={'caret-right-16'} iconSize={16} />
            {item.reference.formattedVendorCreditDate}
          </span>
        </div>
      }
      labelElement={
        <>
          <div className="amount">{item.reference.formattedAmount}</div>
          <VendorCreditUniversalSearchStatus receipt={item.reference} />
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
const transformVendorCreditsToSearch = (vendorCredit: VendorCredit) => ({
  id: vendorCredit.id,
  text: vendorCredit.vendor?.displayName ?? '',
  label: vendorCredit.formattedAmount ?? '',
  reference: vendorCredit,
});

/**
 * Credit note universal search bind configuration.
 */
export const universalSearchVendorCreditBind = () => ({
  resourceType: RESOURCES_TYPES.VENDOR_CREDIT,
  optionItemLabel: intl.get('vendor_credit.label'),
  selectItemAction: VendorCreditUniversalSearchSelect,
  itemRenderer: VendorCreditUniversalSearchItem,
  itemSelect: transformVendorCreditsToSearch,
  permission: {
    ability: VendorCreditAction.View,
    subject: AbilitySubject.VendorCredit,
  },
});
