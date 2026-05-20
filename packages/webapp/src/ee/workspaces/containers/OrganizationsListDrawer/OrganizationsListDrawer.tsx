// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Position } from '@blueprintjs/core';
import styled from '@xstyled/emotion';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { OrganizationsListDrawerContent } from './OrganizationsListDrawerContent';

const OrganizationsDrawer = styled(Drawer)`
  &.bp4-drawer.bp4-dark,
  .bp4-dark &.bp4-drawer {
    background-color: var(--color-dark-gray1);
  }
`;

/**
 * Organizations list drawer.
 */
function OrganizationsListDrawerRoot({
  name,
  // #withDrawer
  isOpen,
  payload,
}) {
  return (
    <OrganizationsDrawer
      isOpen={isOpen}
      name={name}
      size={'100%'}
      position={Position.TOP}
      payload={payload}
    >
      <DrawerSuspense>
        <OrganizationsListDrawerContent />
      </DrawerSuspense>
    </OrganizationsDrawer>
  );
}

export const OrganizationsListDrawer = R.compose(withDrawers())(
  OrganizationsListDrawerRoot,
);
