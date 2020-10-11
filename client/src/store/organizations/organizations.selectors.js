import { createSelector } from '@reduxjs/toolkit';

const oragnizationByTenantIdSelector = (state, props) => state.organizations[props.tenantId];
const organizationByIdSelector = (state, props) => state.organizations.byOrganizationId[props.organizationId];
const organizationsDataSelector = (state, props) => state.organizations.data;

export const getOrganizationByOrgIdFactory = () => createSelector(
  organizationByIdSelector,
  organizationsDataSelector,
  (organizationId, organizationsData) => {
    return organizationsData[organizationId];
  }
);

export const getOrganizationByTenantIdFactory = () => createSelector(
  oragnizationByTenantIdSelector,
  (organization) => organization,
);