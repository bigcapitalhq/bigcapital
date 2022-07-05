import React from 'react';
import * as R from 'ramda';

import { ButtonLink } from '../Button';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

function CustomerDrawerLinkComponent({
  // #ownProps
  children,
  customerId,
  className,

  // #withDrawerActions
  openDrawer,
}) {
  // Handle view customer drawer.
  const handleCustomerDrawer = (event) => {
    openDrawer('customer-details-drawer', { customerId });
    event.preventDefault();
  };

  return (
    <ButtonLink className={className} onClick={handleCustomerDrawer}>
      {children}
    </ButtonLink>
  );
}

export const CustomerDrawerLink = R.compose(withDrawerActions)(
  CustomerDrawerLinkComponent,
);
