// @ts-nocheck
import { Position } from '@blueprintjs/core';
import styled from '@xstyled/emotion';
import * as R from 'ramda';
import React from 'react';
import { CreateWorkspaceDrawerContent } from './CreateWorkspaceDrawerContent';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';

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
