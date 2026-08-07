import React from 'react';
import { Branches } from './Branches';
import { BranchesProvider } from './BranchesProvider';

/**
 * Branches .
 */
export function BranchesPreferences() {
  return (
    <BranchesProvider>
      <Branches />
    </BranchesProvider>
  );
}
