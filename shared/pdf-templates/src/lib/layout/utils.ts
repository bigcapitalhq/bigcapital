import React from 'react';

export const filterFalsyChildren = (children: React.ReactNode) => {
  return React.Children.toArray(children).filter(Boolean);
};
