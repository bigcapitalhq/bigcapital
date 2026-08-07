// @ts-nocheck
import { x } from '@xstyled/emotion';
import * as R from 'ramda';
import React from 'react';
import { CreateWorkspaceStepper } from './CreateWorkspaceStepper';
import { DrawerHeaderContent, FormattedMessage as T } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

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

export const CreateWorkspaceDrawerContent = R.compose(withDrawerActions)(
  CreateWorkspaceDrawerContentRoot,
);
