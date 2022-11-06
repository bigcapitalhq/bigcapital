// @ts-nocheck
import React from 'react';
import { defaultTo, get } from 'lodash';
import { DialogContent } from '@/components';
import {
  useBill,
  useCreateLandedCost,
  useLandedCostTransaction,
} from '@/hooks/query';
import {
  getEntriesByTransactionId,
  getCostTransactionById,
  getTransactionEntryById,
} from './utils';

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
  const [transactionsType, setTransactionsType] = React.useState(null);
  const [transactionId, setTransactionId] = React.useState(null);
  const [transactionEntryId, setTransactionEntryId] = React.useState(null);

  // Handle fetch bill details.
  const { isLoading: isBillLoading, data: bill } = useBill(billId, {
    enabled: !!billId,
  });
  // Retrieve the landed cost transactions based on the given transactions type.
  const {
    data: { transactions: landedCostTransactions },
  } = useLandedCostTransaction(transactionsType, {
    enabled: !!transactionsType,
  });
  // Landed cost selected transaction.
  const costTransaction = React.useMemo(
    () =>
      transactionId
        ? getCostTransactionById(transactionId, landedCostTransactions)
        : null,
    [transactionId, landedCostTransactions],
  );
  // Retrieve the cost transaction entry.
  const costTransactionEntry = React.useMemo(
    () =>
      costTransaction && transactionEntryId
        ? getTransactionEntryById(costTransaction, transactionEntryId)
        : null,
    [costTransaction, transactionEntryId],
  );
  // Retrieve entries of the given transaction id.
  const costTransactionEntries = React.useMemo(
    () =>
      transactionId
        ? getEntriesByTransactionId(landedCostTransactions, transactionId)
        : [],
    [landedCostTransactions, transactionId],
  );
  // Create landed cost mutations.
  const { mutateAsync: createLandedCostMutate } = useCreateLandedCost();

  // Retrieve the unallocate cost amount of cost transaction.
  const unallocatedCostAmount = defaultTo(
    get(costTransactionEntry, 'unallocated_cost_amount'),
    0,
  );

  // Retrieve the unallocate cost amount of cost transaction.
  const formattedUnallocatedCostAmount = defaultTo(
    get(costTransactionEntry, 'formatted_unallocated_cost_amount'),
    0,
  );

  // Provider payload.
  const provider = {
    isBillLoading,
    bill,
    dialogName,
    query,
    createLandedCostMutate,
    costTransaction,
    costTransactionEntries,
    transactionsType,
    landedCostTransactions,
    setTransactionsType,
    setTransactionId,
    setTransactionEntryId,
    costTransactionEntry,
    transactionEntryId,
    transactionId,
    billId,
    unallocatedCostAmount,
    formattedUnallocatedCostAmount,
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
