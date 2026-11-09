import React from 'react';
import '@/style/pages/Users/UserFormDialog.scss';
import { UserForm } from './UserForm';
import { UserFormProvider } from './UserFormProvider';

interface UserFormDialogContentProps {
  userId?: number | null;
  dialogName: string;
  action?: string;
}

/**
 * User form dialog content.
 */
export function UserFormDialogContent({
  userId,
  dialogName,
}: UserFormDialogContentProps): React.ReactElement {
  return (
    <UserFormProvider userId={userId} dialogName={dialogName}>
      <UserForm />
    </UserFormProvider>
  );
}
