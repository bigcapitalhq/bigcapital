import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/reducers';

export const selectIsOrganizationCongrats = createSelector(
  (state: RootState) => state.organizations.congrats,
  (state: RootState) => state.authentication.organizationId,
  (congrats, organizationId) => !!congrats?.[organizationId as string],
);
