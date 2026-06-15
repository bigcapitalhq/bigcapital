// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import { ButtonLink } from '../Button';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { DRAWERS } from '@/constants/drawers';
import { flow } from 'fp-ts/function';

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
    openDrawer(DRAWERS.VENDOR_DETAILS, { vendorId });
    event.preventDefault();
  };

  return (
    <ButtonLink className={className} onClick={handleVendorDrawer}>
      {children}
    </ButtonLink>
  );
}

export const VendorDrawerLink = flow(withDrawerActions)(
  VendorDrawerLinkComponent,
);
