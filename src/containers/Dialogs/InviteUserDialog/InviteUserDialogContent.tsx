// @ts-nocheck
import React from 'react';

import InviteUserForm from './InviteUserForm';
import { InviteUserFormProvider } from './InviteUserFormProvider';

import '@/style/pages/Users/InviteFormDialog.scss';

/**
 * Invite user dialog content.
 */
export default function InviteUserDialogContent({
  action,
  userId,
  dialogName,
}) {
  return (
    <InviteUserFormProvider isEditMode={action} dialogName={dialogName}>
      <InviteUserForm />
    </InviteUserFormProvider>
  );
}
