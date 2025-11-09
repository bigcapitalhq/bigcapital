import React from 'react';
import { x, SystemProps } from '@xstyled/emotion';
import clsx from 'classnames';
import styles from './Paper.module.scss';

interface PaperProps extends SystemProps {
  children: React.ReactNode;
}

export const Paper = ({ children, ...props }: PaperProps) => {
  return (
    <x.div
      {...props}
      className={clsx(styles.root)}
    >
      {children}
    </x.div>
  );
};
Paper.displayName = 'Paper';
