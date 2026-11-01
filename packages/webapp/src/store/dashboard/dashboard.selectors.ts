import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/reducers';

const dialogByNameSelector = (
  state: RootState,
  props: { dialogName: string },
) => state.dashboard.dialogs?.[props.dialogName];

export const isDialogOpenFactory = () =>
  createSelector(dialogByNameSelector, (dialog) => dialog && dialog.isOpen);

export const getDialogPayloadFactory = () =>
  createSelector(dialogByNameSelector, (dialog) => ({ ...dialog?.payload }));

const alertByNameSelector = (state: RootState, props: { name: string }) =>
  state.dashboard.alerts?.[props.name];

export const isAlertOpenFactory = () =>
  createSelector(alertByNameSelector, (alert) => alert && alert.isOpen);

export const getAlertPayloadFactory = () =>
  createSelector(alertByNameSelector, (alert) => ({ ...alert?.payload }));

const drawerByNameSelector = (state: RootState, props: { name: string }) =>
  state.dashboard.drawers?.[props.name];

export const isDrawerOpenFactory = () =>
  createSelector(drawerByNameSelector, (drawer) => drawer && drawer.isOpen);

export const getDrawerPayloadFactory = () =>
  createSelector(drawerByNameSelector, (drawer) => ({ ...drawer?.payload }));

const featuresSelector = (state: RootState) => state.dashboard.features;

export const getDashboardFeaturesSelector = () =>
  createSelector(featuresSelector, (features) => features);
