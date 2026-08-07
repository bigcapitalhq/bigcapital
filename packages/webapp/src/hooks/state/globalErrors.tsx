import { useCallback } from 'react';
import { setGlobalErrors } from '@/store/global-errors/global-errors.actions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export const useSetGlobalErrors = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (errors: Record<string, unknown>) => {
      dispatch(setGlobalErrors(errors));
    },
    [dispatch],
  );
};

export const useGlobalErrors = () => {
  const globalErrors = useAppSelector((state) => state.globalErrors.data);

  return { globalErrors };
};
