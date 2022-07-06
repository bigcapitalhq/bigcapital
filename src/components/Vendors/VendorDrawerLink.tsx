import React from 'react';
import * as R from 'ramda';

import { ButtonLink } from '@/components';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

function VendorDrawerLinkComponent({
  // #ownProps
  children,
  vendorId,
  className,

  // #withDrawerActions
  openDrawer,
}) {
  // Handle view customer drawer.
  const handleVendorDrawer = (event) => {
    openDrawer('vendor-details-drawer', { vendorId });
    event.preventDefault();
  };

  return <ButtonLink className={className} onClick={handleVendorDrawer}>{children}</ButtonLink>;
}

export const VendorDrawerLink = R.compose(withDrawerActions)(VendorDrawerLinkComponent);
