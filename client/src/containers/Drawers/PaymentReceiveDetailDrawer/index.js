import React from 'react';
import { Drawer, DrawerSuspense } from 'components';
import withDrawers from 'containers/Drawer/withDrawers';

import { compose } from 'utils';

const PaymentReceiveDetailContent = React.lazy(() =>
  import('./PaymentReceiveDetailContent'),
);

/**
 * Payment receive detail drawer
 */
function PaymentReceiveDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { paymentReceiveId },
}) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'750px'}>
      <DrawerSuspense>
        <PaymentReceiveDetailContent paymentReceive={paymentReceiveId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers())(PaymentReceiveDetailDrawer);
