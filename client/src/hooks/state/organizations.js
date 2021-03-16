import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setOrganizations } from 'store/organizations/organizations.actions';

export const useSetOrganizations = () => {
  const dispatch = useDispatch();

  return useCallback((organizations) => {
    dispatch(setOrganizations(organizations))    
  }, [dispatch]);
};