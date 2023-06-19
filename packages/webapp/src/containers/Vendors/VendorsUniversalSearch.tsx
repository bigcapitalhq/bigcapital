// @ts-nocheck
import intl from 'react-intl-universal';

import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import { AbilitySubject, VendorAction } from '@/constants/abilityOption';
import withDrawerActions from '../Drawer/withDrawerActions';
import { DRAWERS } from '@/constants/drawers';

/**
 * Vendor universal search item select action.
 */
function VendorUniversalSearchSelectComponent({
  resourceType,
  resourceId,
  onAction,

  // #withDrawerActions
  openDrawer,
}) {
  if (resourceType === RESOURCES_TYPES.VENDOR) {
    openDrawer(DRAWERS.VENDOR_DETAILS, { vendorId: resourceId });
    onAction && onAction();
  }
  return null;
}

const VendorUniversalSearchSelectAction = withDrawerActions(
  VendorUniversalSearchSelectComponent,
);

/**
 * Transforms vendor resource item to search.
 */
const vendorToSearch = (contact) => ({
  id: contact.id,
  text: contact.display_name,
  label: contact.balance > 0 ? contact.formatted_balance + '' : '',
  reference: contact,
});

/**
 * Binds universal search invoice configure.
 */
export const universalSearchVendorBind = () => ({
  resourceType: RESOURCES_TYPES.VENDOR,
  optionItemLabel: intl.get('vendors'),
  selectItemAction: VendorUniversalSearchSelectAction,
  itemSelect: vendorToSearch,
  permission: {
    ability: VendorAction.View,
    subject: AbilitySubject.Vendor,
  },
});
