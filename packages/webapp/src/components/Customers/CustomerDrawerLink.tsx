import React from 'react';
import { ButtonLink } from '../Button';
import { DRAWERS } from '@/constants/drawers';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import { compose } from '@/utils';

interface CustomerDrawerLinkComponentProps extends WithDrawerActionsProps {
  children?: React.ReactNode;
  customerId?: number;
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

export const CustomerDrawerLink = compose(withDrawerActions)(
  CustomerDrawerLinkComponent,
);
