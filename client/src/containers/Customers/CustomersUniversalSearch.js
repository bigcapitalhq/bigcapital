import { RESOURCES_TYPES } from '../../common/resourcesTypes';
import withDrawerActions from '../Drawer/withDrawerActions';

function CustomerUniversalSearchSelectComponent({ resourceType, resourceId }) {
  if (resourceType === RESOURCES_TYPES.CUSTOMER) {
  }
  return null;
}

const CustomerUniversalSearchSelectAction = withDrawerActions(
  CustomerUniversalSearchSelectComponent
);

/**
 * Transformes customers to search.
 * @param {*} contact
 * @returns
 */
const customersToSearch = (contact) => ({
  text: contact.display_name,
  label: contact.formatted_balance,
  reference: contact,
});

/**
 * Binds universal search invoice configure.
 */
export const universalSearchCustomerBind = () => ({
  resourceType: RESOURCES_TYPES.CUSTOMER,
  optionItemLabel: 'Customers',
  selectItemAction: CustomerUniversalSearchSelectAction,
  itemSelect: customersToSearch,
});
