import {
  Position,
  Drawer as BlueprintDrawer,
  DrawerProps as BlueprintDrawerProps,
} from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import '@/style/components/Drawer.scss';
import { DrawerProvider } from './DrawerProvider';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';

export interface DrawerProps extends Omit<BlueprintDrawerProps, 'isOpen'> {
  name: string;
  payload?: Record<string, unknown>;
  isOpen?: boolean;
}

type DrawerInnerProps = DrawerProps & WithDrawerActionsProps;

/**
 * Drawer component.
 */
function DrawerComponent(props: DrawerInnerProps) {
  const {
    name,
    payload,
    isOpen,
    children,
    onClose,
    closeDrawer,
    ...restProps
  } = props;

  const handleClose = (event: React.SyntheticEvent<HTMLElement>) => {
    closeDrawer(name);
    onClose && onClose(event);
  };

  return (
    <BlueprintDrawer
      isOpen={isOpen as boolean}
      size={'700px'}
      canOutsideClickClose={true}
      canEscapeKeyClose={true}
      position={Position.RIGHT}
      onClose={handleClose}
      portalClassName={'drawer-portal'}
      {...restProps}
    >
      <DrawerProvider name={name} payload={payload}>
        {children}
      </DrawerProvider>
    </BlueprintDrawer>
  );
}

const DrawerRoot = FF.pipe(DrawerComponent, withDrawerActions);
export { DrawerRoot as Drawer };
