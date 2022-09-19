// @ts-nocheck
import React from 'react';

import { BranchesProvider } from './BranchesProvider';
import Branches from './Branches';

/**
 * Branches .
 */
export default function BranchesPreferences() {
  return (
    <BranchesProvider>
      <Branches />
    </BranchesProvider>
  );
}
