// @ts-nocheck
import * as R from 'ramda';
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';

const BrandingTemplatesContent = React.lazy(() =>
  import('./BrandingTemplatesContent').then((m) => ({
    default: m.BrandingTemplateContent,
  })),
);

/**
 * Invoice customize drawer.
 * @returns {React.ReactNode}
 */
function BrandingTemplatesDrawerRoot({
  name,
  // #withDrawer
  isOpen,
  payload,
}) {
  return (
    <Drawer isOpen={isOpen} name={name} payload={payload}>
      <DrawerSuspense>
        <BrandingTemplatesContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export const BrandingTemplatesDrawer = R.compose(withDrawers())(
  BrandingTemplatesDrawerRoot,
);
