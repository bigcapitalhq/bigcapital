// @ts-nocheck
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOrganizations } from '@/store/organizations/organizations.actions';
import { getCurrentOrganizationFactory } from '@/store/authentication/authentication.selectors';

export const useSetOrganizations = () => {
  const dispatch = useDispatch();

  return useCallback((organizations) => {
    dispatch(setOrganizations(organizations))    
  }, [dispatch]);
};

export const useCurrentOrganization = () => {
  return useSelector(getCurrentOrganizationFactory())
};