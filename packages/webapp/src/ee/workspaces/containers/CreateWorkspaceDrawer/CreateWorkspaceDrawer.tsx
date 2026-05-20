// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Position } from '@blueprintjs/core';
import styled from '@xstyled/emotion';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { CreateWorkspaceDrawerContent } from './CreateWorkspaceDrawerContent';

const CreateWorkspaceDrawerContainer = styled(Drawer)`
  &.bp4-drawer.bp4-dark,
  .bp4-dark &.bp4-drawer {
    background-color: var(--color-dark-gray1);
  }
`;

/**
 * Create workspace drawer.
 */
function CreateWorkspaceDrawerRoot({
  name,
  // #withDrawer
  isOpen,
  payload,
}) {
  return (
    <CreateWorkspaceDrawerContainer
      isOpen={isOpen}
      name={name}
      size={'700px'}
      position={Position.TOP}
      payload={payload}
    >
      <DrawerSuspense>
        <CreateWorkspaceDrawerContent />
      </DrawerSuspense>
    </CreateWorkspaceDrawerContainer>
  );
}

export const CreateWorkspaceDrawer = R.compose(withDrawers())(
  CreateWorkspaceDrawerRoot,
);
