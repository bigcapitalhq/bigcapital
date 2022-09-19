// @ts-nocheck
import React from 'react';

import UserForm from './UserForm';
import { UserFormProvider } from './UserFormProvider';
import '@/style/pages/Users/UserFormDialog.scss';

/**
 * User form dialog content.
 */
export default function UserFormDialogContent({ userId, dialogName }) {
  return (
    <UserFormProvider userId={userId} dialogName={dialogName}>
      <UserForm />
    </UserFormProvider>
  );
}
