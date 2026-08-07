import intl from 'react-intl-universal';
import type { CustomerDetails } from '@/containers/Drawers/CustomerDetailsDrawer/CustomerDetailsDrawerProvider';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { AbilitySubject, CustomerAction } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

interface CustomerUniversalSearchSelectComponentProps
  extends WithDrawerActionsProps {
  resourceType: string;
  resourceId: number;
  onAction?: () => void;
}

function CustomerUniversalSearchSelectComponent({
  resourceType,
  resourceId,
  onAction,

  // #withDrawerActions
  openDrawer,
}: CustomerUniversalSearchSelectComponentProps) {
  if (resourceType === RESOURCES_TYPES.CUSTOMER) {
    openDrawer(DRAWERS.CUSTOMER_DETAILS, { customerId: resourceId });
    onAction && onAction();
  }
  return null;
}

const CustomerUniversalSearchSelectAction = withDrawerActions(
  CustomerUniversalSearchSelectComponent,
);

/**
 * Transformes customers to search.
 */
const customersToSearch = (contact: CustomerDetails) => ({
  id: contact.id,
  text: contact.displayName,
  label: contact.formattedBalance,
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
