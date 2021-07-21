import React from 'react';
import { AllocateLandedCostDialogProvider } from './AllocateLandedCostDialogProvider';
import AllocateLandedCostForm from './AllocateLandedCostForm';

/**
 * Allocate landed cost dialog content.
 */
export default function AllocateLandedCostDialogContent({
  // #ownProps
  dialogName,
  bill,
}) {
  return (
    <AllocateLandedCostDialogProvider billId={bill} dialogName={dialogName}>
      <AllocateLandedCostForm />
    </AllocateLandedCostDialogProvider>
  );
}
