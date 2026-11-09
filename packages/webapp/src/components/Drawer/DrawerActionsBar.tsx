import { Navbar, NavbarProps } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import styles from './DrawerActionBar.module.scss';

export interface DrawerActionsBarProps extends NavbarProps {}

export function DrawerActionsBar({
  children,
  className,
  ...props
}: DrawerActionsBarProps) {
  return (
    <Navbar {...props} className={classNames(styles.root, className)}>
      {children}
    </Navbar>
  );
}
