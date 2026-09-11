// @ts-nocheck
import { Position, Drawer } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import '@/style/components/Drawer.scss';
import { DrawerProvider } from './DrawerProvider';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

/**
 * Drawer component.
 */
function DrawerComponent(props) {
  const { name, children, onClose, closeDrawer } = props;

  const handleClose = (event) => {
    closeDrawer(name);
    onClose && onClose(event);
  };

  return (
    <Drawer
      size={'700px'}
      canOutsideClickClose={true}
      canEscapeKeyClose={true}
      position={Position.RIGHT}
      onClose={handleClose}
      portalClassName={'drawer-portal'}
      {...props}
    >
      <DrawerProvider {...props}>{children}</DrawerProvider>
    </Drawer>
  );
}

const DrawerRoot = FF.pipe(DrawerComponent, withDrawerActions);
export { DrawerRoot as Drawer };
