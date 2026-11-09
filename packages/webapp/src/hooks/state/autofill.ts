import { useCallback, useEffect, useRef } from 'react';
import { createSelector } from 'reselect';
import type { RootState } from '@/store/reducers';
import {
  addAutofill,
  removeAutofill,
  resetAutofill,
} from '@/store/dashboard/dashboard.actions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const getAutofillPayload = (state: RootState, autofillRef: number) => {
  return typeof state.dashboard.autofill[autofillRef + ''] !== 'undefined'
    ? state.dashboard.autofill[autofillRef]
    : null;
};

const getAutofillPayloadSelectorFactory = () =>
  createSelector(getAutofillPayload, (payload) => payload);

/**
 *
 * @param {number} autofillRef
 * @returns {any}
 */
const useGetAutofillPayload = (autofillRef: number) => {
  const getAutofillPayloadSelector = getAutofillPayloadSelectorFactory();

  return useAppSelector((state) =>
    getAutofillPayloadSelector(state, autofillRef),
  );
};

/**
 *
 * @returns
 */
export const useAddAutofillRef = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (autofillRef: number, payload: unknown) => {
      return dispatch(addAutofill(autofillRef, payload));
    },
    [dispatch],
  );
};

/**
 *
 * @returns
 */
export const useRemoveAutofillRef = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (autofillRef: number) => {
      return dispatch(removeAutofill(autofillRef));
    },
    [dispatch],
  );
};

/**
 *
 * @returns
 */
export const useResetAutofillRefs = () => {
  const dispatch = useAppDispatch();

  return () => {
    return dispatch(resetAutofill());
  };
};

/**
 *
 * @param {(payload: any, ref: number) => void} callback
 * @returns {number}
 */
export const useCreateAutofillListener = (
  callback: (payload: any, ref: number) => void,
): number => {
  const ref = useRef<number>(Date.now());
  const autofillPayload = useGetAutofillPayload(ref.current);
  const removeAutofill = useRemoveAutofillRef();

  useEffect(() => {
    if (autofillPayload) {
      callback(autofillPayload, ref.current);
      removeAutofill(ref.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autofillPayload, removeAutofill]);

  return ref.current;
};
