// @ts-nocheck
import { Navbar } from '@blueprintjs/core';
import React from 'react';
import styles from './DrawerActionBar.module.scss';

export function DrawerActionsBar({ children, ...props }) {
  return <Navbar className={styles.root}>{children}</Navbar>;
}
