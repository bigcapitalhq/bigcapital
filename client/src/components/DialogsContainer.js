import React from 'react';
import AccountFormDialog from 'containers/Dashboard/Dialogs/AccountFormDialog';
import UserFormDialog from 'containers/Dashboard/Dialogs/UserFormDialog';

export default function DialogsContainer() {
  return (
    <React.Fragment>
      <AccountFormDialog />
      <UserFormDialog />
    </React.Fragment>
  );
}