import intl from 'react-intl-universal';
import type { VendorDetails } from '@/containers/Drawers/VendorDetailsDrawer/VendorDetailsDrawerProvider';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { withDrawerActions } from '../Drawer/withDrawerActions';
import { AbilitySubject, VendorAction } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';

interface VendorUniversalSearchSelectComponentProps
  extends WithDrawerActionsProps {
  resourceType: string;
  resourceId: number;
  onAction?: () => void;
}

/**
 * Vendor univesal search item select action.
 */
function VendorUniversalSearchSelectComponent({
  resourceType,
  resourceId,
  onAction,

  // #withDrawerActions
  openDrawer,
}: VendorUniversalSearchSelectComponentProps) {
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
 * Transformes vendor resource item to search.
 */
const vendorToSearch = (contact: VendorDetails) => ({
  id: contact.id,
  text: contact.displayName,
  label: contact.formattedBalance,
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
