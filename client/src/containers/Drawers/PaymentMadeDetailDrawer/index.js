import React from 'react';
import { Drawer, DrawerSuspense } from 'components';
import withDrawers from 'containers/Drawer/withDrawers';

import { compose } from 'utils';

const PaymentMadeDetailContent = React.lazy(() =>
  import('./PaymentMadeDetailContent'),
);

/**
 * Payment made detail drawer.
 */
function PaymentMadeDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { paymentMadeId },
}) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'750px'}>
      <DrawerSuspense>
        <PaymentMadeDetailContent paymentMade={paymentMadeId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers())(PaymentMadeDetailDrawer);
