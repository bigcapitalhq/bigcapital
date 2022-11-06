// @ts-nocheck
import React from 'react';
import { AllocateLandedCostDialogProvider } from './AllocateLandedCostDialogProvider';
import AllocateLandedCostForm from './AllocateLandedCostForm';

/**
 * Allocate landed cost dialog content.
 */
export default function AllocateLandedCostDialogContent({
  // #ownProps
  dialogName,
  billId,
}) {
  return (
    <AllocateLandedCostDialogProvider billId={billId} dialogName={dialogName}>
      <AllocateLandedCostForm />
    </AllocateLandedCostDialogProvider>
  );
}
