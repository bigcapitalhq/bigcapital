// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { x } from '@xstyled/emotion';
import { DrawerHeaderContent, FormattedMessage as T } from '@/components';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { DRAWERS } from '@/constants/drawers';
import { CreateWorkspaceStepper } from './CreateWorkspaceStepper';
import { flow } from 'fp-ts/function';

/**
 * Create workspace drawer content.
 */
function CreateWorkspaceDrawerContentRoot({ closeDrawer }) {
  const handleClose = () => {
    closeDrawer(DRAWERS.CREATE_WORKSPACE);
  };

  return (
    <x.div
      display="flex"
      flex={1}
      flexDirection="column"
      height="100%"
      minHeight={0}
    >
      <DrawerHeaderContent
        name={DRAWERS.CREATE_WORKSPACE}
        title={<T id={'workspace.create_new_workspace'} />}
      />
      <CreateWorkspaceStepper onClose={handleClose} />
    </x.div>
  );
}

export const CreateWorkspaceDrawerContent = flow(withDrawerActions)(
  CreateWorkspaceDrawerContentRoot,
);
