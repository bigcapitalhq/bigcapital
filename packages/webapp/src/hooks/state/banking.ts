import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import {
  getPlaidToken,
  setPlaidId,
  resetPlaidId,
  setTransactionsToCategorizeSelected,
  resetTransactionsToCategorizeSelected,
  getTransactionsToCategorizeSelected,
  addTransactionsToCategorizeSelected,
  removeTransactionsToCategorizeSelected,
  getOpenMatchingTransactionAside,
  getTransactionsToCategorizeIdsSelected,
} from '@/store/banking/banking.reducer';

export const useSetBankingPlaidToken = () => {
  const dispatch = useDispatch();

  return useCallback(
    (plaidId: string) => {
      dispatch(setPlaidId(plaidId));
    },
    [dispatch],
  );
};

export const useGetBankingPlaidToken = () => {
  const plaidToken = useSelector(getPlaidToken);

  return plaidToken;
};

export const useResetBankingPlaidToken = () => {
  const dispatch = useDispatch();

  return useCallback(() => {
    dispatch(resetPlaidId());
  }, [dispatch]);
};

export const useGetTransactionsToCategorizeSelected = () => {
  const selectedTransactions = useSelector(getTransactionsToCategorizeSelected);

  return useMemo(() => selectedTransactions, [selectedTransactions]);
};

export const useSetTransactionsToCategorizeSelected = () => {
  const dispatch = useDispatch();

  return useCallback(
    (ids: Array<string | number>) => {
      return dispatch(setTransactionsToCategorizeSelected({ ids }));
    },
    [dispatch],
  );
};

export const useAddTransactionsToCategorizeSelected = () => {
  const dispatch = useDispatch();

  return useCallback(
    (id: string | number) => {
      return dispatch(addTransactionsToCategorizeSelected({ id }));
    },
    [dispatch],
  );
};

export const useRemoveTransactionsToCategorizeSelected = () => {
  const dispatch = useDispatch();

  return useCallback(
    (id: string | number) => {
      return dispatch(removeTransactionsToCategorizeSelected({ id }));
    },
    [dispatch],
  );
};

export const useResetTransactionsToCategorizeSelected = () => {
  const dispatch = useDispatch();

  return useCallback(() => {
    dispatch(resetTransactionsToCategorizeSelected());
  }, [dispatch]);
};

export const useGetOpenMatchingTransactionAside = () => {
  const openMatchingTransactionAside = useSelector(
    getOpenMatchingTransactionAside,
  );

  return useMemo(
    () => openMatchingTransactionAside,
    [openMatchingTransactionAside],
  );
};

/**
 * Returns the detarmined value whether the given transaction id is checked.
 * @param {number} transactionId
 * @returns {boolean}
 */
export const useIsTransactionToCategorizeSelected = (transactionId: number) => {
  const transactionsToCategorizeIdsSelected = useSelector(
    getTransactionsToCategorizeIdsSelected,
  );
  return useMemo(
    () => transactionsToCategorizeIdsSelected.indexOf(transactionId) !== -1,
    [transactionsToCategorizeIdsSelected, transactionId],
  );
};
