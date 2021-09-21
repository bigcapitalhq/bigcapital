import React from 'react';
import { DrawerBody } from 'components';

import 'style/components/Drawers/ViewDetail/ViewDetail.scss';

import { BillDrawerProvider } from './BillDrawerProvider';
import BillDrawerDetails from './BillDrawerDetails';
// import BillDrawerAlerts from './BillDrawerAlerts';

/**
 * Bill drawer content.
 */
export default function BillDrawerContent({
  // #ownProp
  billId,
}) {
  return (
    <BillDrawerProvider billId={billId}>
      <DrawerBody>
        <BillDrawerDetails />
      </DrawerBody>
    </BillDrawerProvider>
  );
}
