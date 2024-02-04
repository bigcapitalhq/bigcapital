import {
  getPlaidToken,
  setPlaidId,
  resetPlaidId,
} from '@/store/banking/banking.reducer';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
