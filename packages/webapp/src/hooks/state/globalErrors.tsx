import { useCallback } from 'react';
import type { GlobalErrorsData } from '@/store/global-errors/global-errors.reducer';
import { setGlobalErrors } from '@/store/global-errors/global-errors.actions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export const useSetGlobalErrors = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (errors: Partial<GlobalErrorsData>) => {
      dispatch(setGlobalErrors(errors));
    },
    [dispatch],
  );
};

export const useGlobalErrors = () => {
  const globalErrors = useAppSelector((state) => state.globalErrors.data);

  return { globalErrors };
};
