import React from 'react';
import { InviteUserForm } from './InviteUserForm';
import { InviteUserFormProvider } from './InviteUserFormProvider';

import '@/style/pages/Users/InviteFormDialog.scss';

interface InviteUserDialogContentProps {
  action?: string;
  userId?: unknown;
  dialogName: string;
}

/**
 * Invite user dialog content.
 */
export function InviteUserDialogContent({
  action,
  userId,
  dialogName,
}: InviteUserDialogContentProps): React.ReactElement {
  return (
    <InviteUserFormProvider
      isEditMode={action ?? ''}
      dialogName={dialogName}
      userId={userId}
    >
      <InviteUserForm />
    </InviteUserFormProvider>
  );
}
