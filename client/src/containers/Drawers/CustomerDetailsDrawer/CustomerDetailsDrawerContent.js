import React from 'react';

import CustomerDetails from './CustomerDetails';
import { CustomerDetailsDrawerProvider } from './CustomerDetailsDrawerProvider';

/**
 * Contact detail drawer content.
 */
export default function CustomerDetailsDrawerContent({
  // #ownProp
  customerId,
}) {
  return (
    <CustomerDetailsDrawerProvider customerId={customerId}>
      <CustomerDetails />
    </CustomerDetailsDrawerProvider>
  );
}
