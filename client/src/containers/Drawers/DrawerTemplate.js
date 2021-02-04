import React from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Position, Drawer } from '@blueprintjs/core';

export default function DrawerTemplate({
  children,
  isOpen,
  isClose,
  drawerProps,
}) {
  return (
    <div>
      <Drawer
        isOpen={isOpen}
        usePortal={false}
        hasBackdrop={true}
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
    </div>
  );
}
