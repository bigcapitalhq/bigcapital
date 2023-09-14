// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Drawer, DrawerHeaderContent, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';
import { DRAWERS } from '@/constants/drawers';

const TaxRateDetailsDrawerContent = React.lazy(
  () => import('./TaxRateDetailsContent'),
);

/**
 * Tax rate details drawer.
 */
function TaxRateDetailsDrawer({
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

export default R.compose(withDrawers())(TaxRateDetailsDrawer);
