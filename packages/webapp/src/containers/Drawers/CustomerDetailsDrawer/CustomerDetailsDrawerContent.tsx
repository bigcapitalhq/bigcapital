import React from 'react';
import { CustomerDetails } from './CustomerDetails';
import { CustomerDetailsDrawerProvider } from './CustomerDetailsDrawerProvider';
import { DrawerBody } from '@/components';

interface CustomerDetailsDrawerContentProps {
  customerId: number | undefined;
}

/**
 * Contact detail drawer content.
 */
export function CustomerDetailsDrawerContent({
  customerId,
}: CustomerDetailsDrawerContentProps) {
  return (
    <CustomerDetailsDrawerProvider customerId={customerId}>
      <DrawerBody>
        <CustomerDetails />
      </DrawerBody>
    </CustomerDetailsDrawerProvider>
  );
}
