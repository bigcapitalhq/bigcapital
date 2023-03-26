// @ts-nocheck
import { createSelector } from '@reduxjs/toolkit';

const dialogByNameSelector = (state, props) =>
  state.dashboard.dialogs?.[props.dialogName];

export const isDialogOpenFactory = () =>
  createSelector(dialogByNameSelector, (dialog) => {
    return dialog && dialog.isOpen;
  });

export const getDialogPayloadFactory = () =>
  createSelector(dialogByNameSelector, (dialog) => {
    return { ...dialog?.payload };
  });

const alertByNameSelector = (state, props) =>
  state.dashboard.alerts?.[props.name];

export const isAlertOpenFactory = () =>
  createSelector(alertByNameSelector, (alert) => {
    return alert && alert.isOpen;
  });

export const getAlertPayloadFactory = () =>
  createSelector(alertByNameSelector, (alert) => {
    return { ...alert?.payload };
  });

const drawerByNameSelector = (state, props) =>
  state.dashboard.drawers?.[props.name];

export const isDrawerOpenFactory = () =>
  createSelector(drawerByNameSelector, (drawer) => {
    return drawer && drawer.isOpen;
  });

export const getDrawerPayloadFactory = () =>
  createSelector(drawerByNameSelector, (drawer) => {
    return { ...drawer?.payload };
  });

const featuresSelector = (state, props) => {
  return state.dashboard.features;
};

export const getDashboardFeaturesSelector = () =>
  createSelector(featuresSelector, (features) => {
    return features;
  });
