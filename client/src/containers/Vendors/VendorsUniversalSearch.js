import intl from 'react-intl-universal';

import { RESOURCES_TYPES } from '../../common/resourcesTypes';
import withDrawerActions from '../Drawer/withDrawerActions';

/**
 * Vendor univesal search item select action.
 */
function VendorUniversalSearchSelectComponent({
  resourceType,
  resourceId,
  onAction,

  // #withDrawerActions
  openDrawer,
}) {
  if (resourceType === RESOURCES_TYPES.VENDOR) {
    openDrawer('vendor-details-drawer', { vendorId: resourceId });
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
});
