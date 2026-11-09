import * as FF from 'fp-ts/function';
import React from 'react';
import type { WithDrawersProps } from '@/containers/Drawer/withDrawers';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';

interface StripeIntegrationEditDrawerRootProps {
  name: string;
}

type StripeIntegrationEditDrawerRootConnectedProps =
  StripeIntegrationEditDrawerRootProps & WithDrawersProps;

/**
 * Stripe integration edit drawer.
 */
function StripeIntegrationEditDrawerRoot({
  name,

  // #withDrawer
  isOpen,
  payload,
}: StripeIntegrationEditDrawerRootConnectedProps) {
  return (
    <Drawer isOpen={isOpen} name={name} payload={payload} size={'600px'}>
      <DrawerSuspense>
        <StripeIntegrationEditContent />
      </DrawerSuspense>
    </Drawer>
  );
}

const StripeIntegrationEditContent = React.lazy(() =>
  import('./StripeIntegrationEditContent').then((module) => ({
    default: module.StripeIntegrationEditContent,
  })),
);

export const StripeIntegrationEditDrawer = FF.pipe(
  StripeIntegrationEditDrawerRoot,
  withDrawers(),
);
