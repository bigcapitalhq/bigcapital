import { createSelector } from '@reduxjs/toolkit';

const oragnizationByTenantIdSelector = (state, props) => state.organizations[props.tenantId];
const organizationByIdSelector = (state, props) => state.organizations.byOrganizationId[props.organizationId];

export const getOrganizationByOrgIdFactory = () => createSelector(
  organizationByIdSelector,
  (organization) => {
    return organization;
  },
);

export const getOrganizationByTenantIdFactory = () => createSelector(
  oragnizationByTenantIdSelector,
  (organization) => {
    return organization;
  }
)