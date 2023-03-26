// @ts-nocheck
import React from 'react';

import { DrawerBody } from '@/components';
import { CustomerDetailsDrawerProvider } from './CustomerDetailsDrawerProvider';
import CustomerDetails from './CustomerDetails';

/**
 * Contact detail drawer content.
 */
export default function CustomerDetailsDrawerContent({
  // #ownProp
  customerId,
}) {
  return (
    <CustomerDetailsDrawerProvider customerId={customerId}>
      <DrawerBody>
        <CustomerDetails />
      </DrawerBody>
    </CustomerDetailsDrawerProvider>
  );
}
