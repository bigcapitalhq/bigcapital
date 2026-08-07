import { defaultTo, get } from 'lodash';
import React from 'react';
import {
  getEntriesByTransactionId,
  getCostTransactionById,
  getTransactionEntryById,
} from './utils';
import type {
  AllocateLandedCostBill,
  AllocateLandedCostDialogContextValue,
  AllocateLandedCostFormEntry,
  LandedCostTransaction,
  LandedCostTransactionEntry,
} from './types';
import { DialogContent } from '@/components';
import {
  useBill,
  useCreateLandedCost,
  useLandedCostTransaction,
} from '@/hooks/query';

const AllocateLandedCostDialogContext =
  React.createContext<AllocateLandedCostDialogContextValue>(
    // @ts-expect-error — intentionally provide no default; consumers must render inside Provider.
    {},
  );

interface AllocateLandedCostDialogProviderProps {
  billId?: number | null;
  query?: Record<string, unknown>;
  dialogName: string;
  children?: React.ReactNode;
}

/**
 * Allocate landed cost provider.
 */
function AllocateLandedCostDialogProvider({
  billId,
  query,
  dialogName,
  ...props
}: AllocateLandedCostDialogProviderProps) {
  const [transactionsType, setTransactionsType] =
    React.useState<string>('Bill');
  const [transactionId, setTransactionId] = React.useState<number | null>(null);
  const [transactionEntryId, setTransactionEntryId] = React.useState<
    number | null
  >(null);

  // Handle fetch bill details.
  // FIXME: SDK `Bill` is camelCase but form code reads `bill.entries` with snake_case
  // entry fields. Cast to loose `AllocateLandedCostBill` shape.
  const { isLoading: isBillLoading, data: bill } = useBill(billId, {
    enabled: !!billId,
  });
  // Retrieve the landed cost transactions based on the given transactions type.
  const {
    data: landedCostTransactions,
    isLoading: isLandedCostTransactionsLoading,
  } = useLandedCostTransaction(transactionsType, {
    enabled: !!transactionsType,
  });
  const landedCostTransactionsLoose = React.useMemo(
    () => (landedCostTransactions as LandedCostTransaction[] | undefined) ?? [],
    [landedCostTransactions],
  );
  // Landed cost selected transaction.
  const costTransaction = React.useMemo(
    () =>
      transactionId
        ? getCostTransactionById(transactionId, landedCostTransactionsLoose)
        : null,
    [transactionId, landedCostTransactionsLoose],
  );
  // Retrieve the cost transaction entry.
  const costTransactionEntry = React.useMemo<
    LandedCostTransactionEntry | undefined
  >(
    () =>
      costTransaction && transactionEntryId
        ? (getTransactionEntryById(costTransaction, transactionEntryId) as
            | LandedCostTransactionEntry
            | undefined)
        : undefined,
    [costTransaction, transactionEntryId],
  );
  // Retrieve entries of the given transaction id.
  const costTransactionEntries = React.useMemo<LandedCostTransactionEntry[]>(
    () =>
      transactionId
        ? (getEntriesByTransactionId(
            landedCostTransactionsLoose,
            transactionId,
          ) as LandedCostTransactionEntry[])
        : [],
    [landedCostTransactionsLoose, transactionId],
  );
  // Create landed cost mutations.
  // FIXME: `useCreateLandedCost` requires a `props` argument; original code passed none.
  const { mutateAsync: createLandedCostMutate } =
    useCreateLandedCost(undefined);

  // Retrieve the unallocate cost amount of cost transaction.
  const unallocatedCostAmount = defaultTo(
    get(costTransactionEntry, 'unallocatedCostAmount'),
    0,
  );

  // Retrieve the unallocate cost amount of cost transaction.
  const formattedUnallocatedCostAmount = defaultTo(
    get(costTransactionEntry, 'formattedUnallocatedCostAmount'),
    0,
  );

  // Provider payload.
  const provider: AllocateLandedCostDialogContextValue = {
    isBillLoading,
    bill: bill as AllocateLandedCostBill | undefined,
    dialogName,
    query,
    createLandedCostMutate,
    costTransaction,
    costTransactionEntries,
    transactionsType,
    landedCostTransactions: landedCostTransactionsLoose,
    isLandedCostTransactionsLoading,
    setTransactionsType,
    setTransactionId,
    setTransactionEntryId,
    costTransactionEntry: (costTransactionEntry ??
      null) as LandedCostTransactionEntry | null,
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

export type { AllocateLandedCostFormEntry };
