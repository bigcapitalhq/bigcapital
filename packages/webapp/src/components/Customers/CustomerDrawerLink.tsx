import * as FF from 'fp-ts/function';
import React from 'react';
import { ButtonLink } from '../Button';
import { DRAWERS } from '@/constants/drawers';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';

interface CustomerDrawerLinkComponentProps extends WithDrawerActionsProps {
  children?: React.ReactNode;
  customerId?: number | string;
  className?: string;
}

function CustomerDrawerLinkComponent({
  // #ownProps
  children,
  customerId,
  className,

  // #withDrawerActions
  openDrawer,
}: CustomerDrawerLinkComponentProps) {
  // Handle view customer drawer.
  const handleCustomerDrawer = (event: React.MouseEvent) => {
    openDrawer(DRAWERS.CUSTOMER_DETAILS, { customerId });
    event.preventDefault();
  };

  return (
    <ButtonLink className={className} onClick={handleCustomerDrawer}>
      {children}
    </ButtonLink>
  );
}

export const CustomerDrawerLink = FF.pipe(
  CustomerDrawerLinkComponent,
  withDrawerActions,
);
