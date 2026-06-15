// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Drawer, DrawerHeaderContent, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { DRAWERS } from '@/constants/drawers';
import { flow } from 'fp-ts/function';

const TaxRateDetailsDrawerContent = React.lazy(() =>
  import('./TaxRateDetailsContent').then((m) => ({
    default: m.TaxRateDetailsContent,
  })),
);

/**
 * Tax rate details drawer.
 */
function TaxRateDetailsDrawerInner({
  name,
  // #withDrawer
  isOpen,
  payload: { taxRateId },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '650px', maxWidth: '650px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <TaxRateDetailsDrawerContent name={name} taxRateId={taxRateId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const TaxRateDetailsDrawer = flow(withDrawers())(
  TaxRateDetailsDrawerInner,
);
