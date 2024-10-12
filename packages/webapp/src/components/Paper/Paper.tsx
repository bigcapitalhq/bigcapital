import React from 'react';
import { x, SystemProps } from '@xstyled/emotion';

interface PaperProps extends SystemProps {
  children: React.ReactNode;
}

export const Paper = ({ children, ...props }: PaperProps) => {
  return (
    <x.div
      background={'white'}
      p={'10px'}
      border={'1px solid #d2dce2'}
      {...props}
    >
      {children}
    </x.div>
  );
};
Paper.displayName = 'Paper';
