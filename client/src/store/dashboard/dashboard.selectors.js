import { createSelector } from "@reduxjs/toolkit";

const dialogByNameSelector = (state, props) => state.dashboard.dialogs?.[props.dialogName];

export const isDialogOpenFactory = () => createSelector(
  dialogByNameSelector,
  (dialog) => {
    return dialog && dialog.isOpen;
  },
);

export const getDialogPayloadFactory = () => createSelector(
  dialogByNameSelector,
  (dialog) => {
    return { ...dialog?.payload };
  },
);