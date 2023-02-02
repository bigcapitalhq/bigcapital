// @ts-nocheck
import { defaultTo } from 'lodash';
import { createSelector } from '@reduxjs/toolkit';

const getCurrentOrganizationId = (state) => state.authentication.organizationId;
const getCurrentTenantId = (state) => state.authentication.tenantId;
const getOrganizationsMap = (state) => state.organizations.data;

// Retrieve organization tenant id.
export const getOrganizationTenantIdFactory = () =>
  createSelector(getCurrentTenantId, (tenantId) => tenantId);

// Retrieve organization id.
export const getOrganizationIdFactory = () =>
  createSelector(getCurrentOrganizationId, (tenantId) => tenantId);

// Retrieve current organization meta object.
export const getCurrentOrganizationFactory = () =>
  createSelector(
    getCurrentTenantId,
    getOrganizationsMap,
    (tenantId, organizationsMap) => {
      return defaultTo(organizationsMap[tenantId], {});
    },
  );
