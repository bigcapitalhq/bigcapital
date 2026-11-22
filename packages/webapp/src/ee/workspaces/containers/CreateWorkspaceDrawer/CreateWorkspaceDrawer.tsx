import { Position } from '@blueprintjs/core';
import styled from '@xstyled/emotion';
import * as FF from 'fp-ts/function';
import React from 'react';
import { CreateWorkspaceDrawerContent } from './CreateWorkspaceDrawerContent';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';
import { NS } from '@/constants/classes';

const CreateWorkspaceDrawerContainer = styled(Drawer)`
  &.${NS}-drawer.${NS}-dark, .${NS}-dark &.${NS}-drawer {
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
}: WithDrawersProps & { name: string }) {
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

export const CreateWorkspaceDrawer = FF.pipe(
  CreateWorkspaceDrawerRoot,
  withDrawers(),
);
