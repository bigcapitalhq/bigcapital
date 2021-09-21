import React from 'react';
import { DialogContent } from 'components';
import { useBill, useCreateLandedCost } from 'hooks/query';

const AllocateLandedCostDialogContext = React.createContext();

/**
 * Allocate landed cost provider.
 */
function AllocateLandedCostDialogProvider({
  billId,
  query,
  dialogName,
  ...props
}) {
  // Handle fetch bill details.
  const { isLoading: isBillLoading, data: bill } = useBill(billId, {
    enabled: !!billId,
  });

  // Create landed cost mutations.
  const { mutateAsync: createLandedCostMutate } = useCreateLandedCost();

  // provider payload.
  const provider = {
    isBillLoading,
    bill,
    dialogName,
    query,
    createLandedCostMutate,
    billId,
  };

  return (
    <DialogContent isLoading={isBillLoading} name={'allocate-landed-cost'}>
      <AllocateLandedCostDialogContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useAllocateLandedConstDialogContext = () =>
  React.useContext(AllocateLandedCostDialogContext);

export {
  AllocateLandedCostDialogProvider,
  useAllocateLandedConstDialogContext,
};
