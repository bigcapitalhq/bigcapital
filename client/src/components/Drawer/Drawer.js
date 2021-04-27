import React from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Position, Drawer } from '@blueprintjs/core';

export default function ({
  title = <T id={'view_paper'} />,
  children,
  isOpen,
  isClose,
  drawerProps,
}) {
  
  return (
    <Drawer
      isOpen={isOpen}
      title={title}
      position={Position.RIGHT}
      canOutsideClickClose={true}
      canEscapeKeyClose={true}
      size={'700px'}
      onClose={isClose}
      {...drawerProps}
    >
      {children}
    </Drawer>
  );
}
