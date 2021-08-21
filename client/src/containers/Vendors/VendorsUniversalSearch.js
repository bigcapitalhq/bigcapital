import intl from 'react-intl-universal';

import { RESOURCES_TYPES } from '../../common/resourcesTypes';
import withDrawerActions from '../Drawer/withDrawerActions';

function VendorUniversalSearchSelectComponent({ resourceType, resourceId }) {
  if (resourceType === RESOURCES_TYPES.VENDOR) {
  }
  return null;
}

const VendorUniversalSearchSelectAction = withDrawerActions(
  VendorUniversalSearchSelectComponent
);

/**
 * Transformes vendor resource item to search.
 */
const vendorToSearch = (contact) => ({
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
