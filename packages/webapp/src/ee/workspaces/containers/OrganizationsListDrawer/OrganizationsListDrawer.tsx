import { Position } from '@blueprintjs/core';
import styled from '@xstyled/emotion';
import * as FF from 'fp-ts/function';
import React from 'react';
import { OrganizationsListDrawerContent } from './OrganizationsListDrawerContent';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';
import { NS } from '@/constants/classes';

const OrganizationsDrawer = styled(Drawer)`
  &.${NS}-drawer.${NS}-dark, .${NS}-dark &.${NS}-drawer {
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
}: WithDrawersProps & { name: string }) {
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

export const OrganizationsListDrawer = FF.pipe(
  OrganizationsListDrawerRoot,
  withDrawers(),
);
