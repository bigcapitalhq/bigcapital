import React from 'react';
import * as R from 'ramda';

import { ButtonLink } from '../Button';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

function CustomerDrawerLinkComponent({
  // #ownProps
  children,
  customerId,

  // #withDrawerActions
  openDrawer,
}) {
  // Handle view customer drawer.
  const handleCustomerDrawer = () => {
    openDrawer('customer-details-drawer', { customerId });
  };

  return <ButtonLink onClick={handleCustomerDrawer}>{children}</ButtonLink>;
}

export const CustomerDrawerLink = R.compose(withDrawerActions)(
  CustomerDrawerLinkComponent,
);
