import { createSelector } from "@reduxjs/toolkit";

const dialogByNameSelector = (dialogName) => (state) => state.dashboard.dialogs?.[dialogName];

export const isDialogOpenFactory = (dialogName) => createSelector(
  dialogByNameSelector(dialogName),
  (dialog) => {
    return dialog && dialog.isOpen;
  },
);

export const getDialogPayloadFactory = (dialogName) => createSelector(
  dialogByNameSelector(dialogName),
  (dialog) => {
    return { ...dialog?.payload };
  },
);