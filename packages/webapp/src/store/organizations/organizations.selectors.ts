import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/reducers';

type OrgProps = { organizationId: string };
type OrgRecord = Record<string, unknown>;

const organizationSelector = (state: RootState, props: OrgProps): OrgRecord | undefined => {
  const tenantId = state.organizations.byOrganizationId[props.organizationId] as string;
  return state.organizations.data[tenantId] as OrgRecord | undefined;
};

export const getOrganizationByIdFactory = () =>
  createSelector(organizationSelector, (organization) => organization);

export const isOrganizationSeededFactory = () =>
  createSelector(organizationSelector, (organization) => {
    return !!organization?.['seeded_at'];
  });

export const isOrganizationBuiltFactory = () =>
  createSelector(organizationSelector, (organization) => {
    return !!organization?.['initialized_at'];
  });

export const isOrganizationReadyFactory = () =>
  createSelector(organizationSelector, (organization) => {
    return organization?.['is_ready'];
  });

export const isOrganizationSubscribedFactory = () =>
  createSelector(organizationSelector, (organization) => {
    return (organization?.['subscriptions'] as Array<unknown> | undefined)?.length! > 0;
  });

export const isOrganizationCongratsFactory = () =>
  createSelector(organizationSelector, (organization) => {
    return !!organization?.['is_congrats'];
  });

export const isOrganizationBuildRunningFactory = () =>
  createSelector(organizationSelector, (organization) => {
    return !!organization?.['is_build_running'];
  });
