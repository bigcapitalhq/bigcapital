import React from 'react';
import { DialogContent } from 'components';
import { useBill } from 'hooks/query';

import { pick } from 'lodash';

const AllocateLandedCostDialogContext = React.createContext();

/**
 * Allocate landed cost provider.
 */
function AllocateLandedCostDialogProvider({ billId, dialogName, ...props }) {
  // Handle fetch bill details.
  const { isLoading: isBillLoading, data: bill } = useBill(billId, {
    enabled: !!billId,
  });

  // provider payload.
  const provider = {
    bill: {
      ...pick(bill, ['entries']),
    },
    dialogName,
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
