// @ts-nocheck
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '@/store/settings/settings.actions';

export const useSetSettings = () => {
  const dispatch = useDispatch();

  return useCallback(
    (settings) => {
      dispatch(setSettings(settings));
    },
    [dispatch],
  );
};

/**
 * Retrieve the authentication token.
 */
export const useSettingsSelector = () => {
  return useSelector((state) => state.settings.data);
};
