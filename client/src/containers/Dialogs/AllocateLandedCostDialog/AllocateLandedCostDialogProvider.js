import React from 'react';
import { DialogContent } from 'components';
import { useBill, useCreateLandedCost } from 'hooks/query';

import { map, omit, pick } from 'lodash';
import * as R from 'ramda';

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

  // const L = [bill].map(({ entries: items }) => ({
  //   items,
  // }));
  // let obj = { oldKey: 1, b: 2, c: 3 };
  // const { oldKey: newKey, ...rest } = obj;
  // obj = { newKey, ...rest };

  // const obj = { ...pick(bill, ['entries']).map((index) => index) };


  // provider payload.
  const provider = {
    items: {
      ...pick(bill, ['entries']),
    },
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
