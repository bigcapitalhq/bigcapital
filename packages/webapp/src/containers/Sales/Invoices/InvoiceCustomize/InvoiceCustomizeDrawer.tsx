import * as FF from 'fp-ts/function';
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';

const InvoiceCustomize = React.lazy(() =>
  import('./InvoiceCustomize').then((m) => ({ default: m.InvoiceCustomize })),
);

interface InvoiceCustomizeDrawerRootProps {
  name: string;
}

type InvoiceCustomizeDrawerRootConnectedProps =
  InvoiceCustomizeDrawerRootProps & WithDrawersProps;

/**
 * Invoice customize drawer.
 * @returns {React.ReactNode}
 */
function InvoiceCustomizeDrawerRoot({
  name,
  // #withDrawer
  isOpen,
  payload,
}: InvoiceCustomizeDrawerRootConnectedProps) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      payload={payload}
      size={'calc(100% - 10px)'}
    >
      <DrawerSuspense>
        <InvoiceCustomize />
      </DrawerSuspense>
    </Drawer>
  );
}

export const InvoiceCustomizeDrawer = FF.pipe(
  InvoiceCustomizeDrawerRoot,
  withDrawers(),
);
