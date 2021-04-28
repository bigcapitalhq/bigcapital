import React from 'react';
import { Position, Drawer } from '@blueprintjs/core';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

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
      {...props}
    >
      {children}
    </Drawer>
  );
}

export default compose(withDrawerActions)(DrawerComponent);
