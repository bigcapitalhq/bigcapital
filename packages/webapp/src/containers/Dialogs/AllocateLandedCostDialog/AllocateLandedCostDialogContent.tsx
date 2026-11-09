import { AllocateLandedCostDialogProvider } from './AllocateLandedCostDialogProvider';
import { AllocateLandedCostForm } from './AllocateLandedCostForm';
import type { AllocateLandedCostDialogPayload } from './types';

interface AllocateLandedCostDialogContentProps {
  // #ownProps
  dialogName: string;
  billId: AllocateLandedCostDialogPayload['billId'];
}

/**
 * Allocate landed cost dialog content.
 */
export function AllocateLandedCostDialogContent({
  // #ownProps
  dialogName,
  billId,
}: AllocateLandedCostDialogContentProps) {
  return (
    <AllocateLandedCostDialogProvider billId={billId} dialogName={dialogName}>
      <AllocateLandedCostForm />
    </AllocateLandedCostDialogProvider>
  );
}
