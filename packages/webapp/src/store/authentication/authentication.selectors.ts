import { defaultTo } from 'lodash';
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/reducers';

const getCurrentOrganizationId = (state: RootState) =>
  state.authentication.organizationId;

const getOrganizationsMap = (state: RootState) =>
  state.organizations.data as Record<string, unknown>;

const getOrganizationsByOrgIdMap = (state: RootState) =>
  state.organizations.byOrganizationId as Record<string, unknown>;

export const getOrganizationIdFactory = () =>
  createSelector(getCurrentOrganizationId, (organizationId) => organizationId);

export const getCurrentOrganizationFactory = () =>
  createSelector(
    getCurrentOrganizationId,
    getOrganizationsByOrgIdMap,
    getOrganizationsMap,
    (organizationId, byOrganizationId, organizationsMap) => {
      const tenantId = byOrganizationId?.[organizationId as string] as string;
      return defaultTo(organizationsMap[tenantId], {});
    },
  );
