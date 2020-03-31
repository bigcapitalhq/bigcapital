import React from 'react';
import AccountFormDialog from 'containers/Dashboard/Dialogs/AccountFormDialog';
import UserFormDialog from 'containers/Dashboard/Dialogs/UserFormDialog';
import ItemFromDialog from 'containers/Dashboard/Dialogs/ItemFromDialog';

export default function DialogsContainer() {
  return (
    <React.Fragment>
      <AccountFormDialog />
      <UserFormDialog />
      <ItemFromDialog />
    </React.Fragment>
  );
}
