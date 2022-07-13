import intl from 'react-intl-universal';
import { AbilitySubject, CustomerAction } from '@/constants/abilityOption';

import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

function CustomerUniversalSearchSelectComponent({
  resourceType,
  resourceId,
  onAction,

  // #withDrawerActions
  openDrawer,
}) {
  if (resourceType === RESOURCES_TYPES.CUSTOMER) {
    openDrawer('customer-details-drawer', { customerId: resourceId });
    onAction && onAction();
  }
  return null;
}

const CustomerUniversalSearchSelectAction = withDrawerActions(
  CustomerUniversalSearchSelectComponent,
);

/**
 * Transformes customers to search.
 * @param {*} contact
 * @returns
 */
const customersToSearch = (contact) => ({
  id: contact.id,
  text: contact.display_name,
  label: contact.formatted_balance,
  reference: contact,
});

/**
 * Binds universal search invoice configure.
 */
export const universalSearchCustomerBind = () => ({
  resourceType: RESOURCES_TYPES.CUSTOMER,
  optionItemLabel: intl.get('customers'),
  selectItemAction: CustomerUniversalSearchSelectAction,
  itemSelect: customersToSearch,
  permission: {
    ability: CustomerAction.View,
    subject: AbilitySubject.Customer,
  },
});
