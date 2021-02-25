import React from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Position, Drawer } from '@blueprintjs/core';

export default function ({ children, isOpen, isClose, drawerProps }) {
  return (
    <Drawer
      isOpen={isOpen}
      title={<T id={'view_paper'} />}
      position={Position.RIGHT}
      canOutsideClickClose={true}
      canEscapeKeyClose={true}
      size={'65%'}
      onClose={isClose}
      {...drawerProps}
    >
      {children}
    </Drawer>
  );
}
