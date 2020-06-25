import { createSelector } from "@reduxjs/toolkit";


const dialogByNameSelector = (state, props) => state.dashboard.dialogs[props.name];

export const isDialogOpen = createSelector(
  dialogByNameSelector,
  (dialog) => {
    return dialog && dialog.isOpen;
  },
);

export const getDialogPayload = createSelector(
  dialogByNameSelector,
  (dialog) => {
    return dialog?.payload;
  },
);