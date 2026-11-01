import * as FF from 'fp-ts/function';
import React from 'react';
import { ButtonLink } from '../Button';
import { DRAWERS } from '@/constants/drawers';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';

interface VendorDrawerLinkComponentProps extends WithDrawerActionsProps {
  children?: React.ReactNode;
  vendorId?: number;
  className?: string;
}

function VendorDrawerLinkComponent({
  // #ownProps
  children,
  vendorId,
  className,

  // #withDrawerActions
  openDrawer,
}: VendorDrawerLinkComponentProps) {
  // Handle view customer drawer.
  const handleVendorDrawer = (event: React.MouseEvent) => {
    openDrawer(DRAWERS.VENDOR_DETAILS, { vendorId });
    event.preventDefault();
  };

  return (
    <ButtonLink className={className} onClick={handleVendorDrawer}>
      {children}
    </ButtonLink>
  );
}

export const VendorDrawerLink = FF.pipe(
  VendorDrawerLinkComponent,
  withDrawerActions,
);
