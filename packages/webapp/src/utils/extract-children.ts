import React from 'react';

export const extractChildren = <T extends React.ReactNode>(
  children: React.ReactNode,
  type: React.ElementType,
): T[] => {
  return React.Children.toArray(children).filter(
    (node) => React.isValidElement(node) && node.type === type,
  ) as T[];
};
