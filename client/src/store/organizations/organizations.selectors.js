import { createSelector } from '@reduxjs/toolkit';

const organizationSelector = (state, props) => state.organizations.data[props.organizationId];

export const getOrganizationByIdFactory = () => createSelector(
  organizationSelector,
  (organization) => organization
);

export const isOrganizationSeededFactory = () => createSelector(
  organizationSelector,
  (organization) => {
    return !!organization?.seeded_at;
  },
);

export const isOrganizationBuiltFactory = () => createSelector(
  organizationSelector,
  (organization) => {
    return !!organization?.initialized_at;
  },
);

export const isOrganizationInitializingFactory = () => createSelector(
  organizationSelector,
  (organization) => {
    return organization?.is_initializing;
  },
);

export const isOrganizationSeedingFactory = () => createSelector(
  organizationSelector,
  (organization) => {
    return organization?.is_seeding;
  },
);

export const isOrganizationReadyFactory = () => createSelector(
  organizationSelector,
  (organization) => {
    return organization?.is_ready;
  },
);

export const isOrganizationSubscribedFactory = () => createSelector(
  organizationSelector,
  (organization) => {
    return organization?.subscriptions?.length > 0;
  }
)