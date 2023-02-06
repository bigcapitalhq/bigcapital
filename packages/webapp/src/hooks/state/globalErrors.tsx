// @ts-nocheck
import { useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setGlobalErrors } from '@/store/globalErrors/globalErrors.actions';

export const useSetGlobalErrors = () => {
  const dispatch = useDispatch();

  return useCallback((errors) => {
    dispatch(setGlobalErrors(errors));
  }, [dispatch]);
};

export const useGlobalErrors = () => {
  const globalErrors = useSelector(state => state.globalErrors.data);

  return { globalErrors };
}