import React from 'react';
import { Position, Drawer } from '@blueprintjs/core';

import 'style/components/Drawer.scss';

import withDrawerActions from 'containers/Drawer/withDrawerActions';
import { compose } from 'utils';

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
      {children}
    </Drawer>
  );
}

export default compose(withDrawerActions)(DrawerComponent);
