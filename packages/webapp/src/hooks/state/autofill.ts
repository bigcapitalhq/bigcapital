// @ts-nocheck
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import {
  addAutofill,
  removeAutofill,
  resetAutofill,
} from '@/store/dashboard/dashboard.actions';

const getAutofillPayload = (state, autofillRef) => {
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

  return useSelector((state) => getAutofillPayloadSelector(state, autofillRef));
};

/**
 *
 * @returns
 */
export const useAddAutofillRef = () => {
  const dispatch = useDispatch();

  return useCallback(
    (autofillRef: number, payload: any) => {
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
  const dispatch = useDispatch();

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
  const dispatch = useDispatch();

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
