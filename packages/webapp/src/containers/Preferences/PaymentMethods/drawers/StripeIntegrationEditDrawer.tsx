// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const StripeIntegrationEditContent = React.lazy(() =>
  import('./StripeIntegrationEditContent').then((module) => ({
    default: module.StripeIntegrationEditContent,
  })),
);

/**
 * Stripe integration edit drawer.
 * @returns {React.ReactNode}
 */
function StripeIntegrationEditDrawerRoot({
  name,

  // #withDrawer
  isOpen,
  payload,
}) {
  return (
    <Drawer isOpen={isOpen} name={name} payload={payload} size={'600px'}>
      <DrawerSuspense>
        <StripeIntegrationEditContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export const StripeIntegrationEditDrawer = flow(withDrawers())(
  StripeIntegrationEditDrawerRoot,
);
