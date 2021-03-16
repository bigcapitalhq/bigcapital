import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setSettings } from 'store/settings/settings.actions';


export const useSetSettings = () => {
  const dispatch =  useDispatch();

  return useCallback((settings) => {
    dispatch(setSettings(settings));
  }, [dispatch]);
};