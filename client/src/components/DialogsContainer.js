import React from 'react';
import AccountFormDialog from 'containers/Dashboard/Dialogs/AccountFormDialog';
import UserFormDialog from 'containers/Dashboard/Dialogs/UserFormDialog';
import ItemFCategoryDialog from 'containers/Dashboard/Dialogs/ItemCategoryDialog';

export default function DialogsContainer() {
  return (
    <React.Fragment>
      <ItemFCategoryDialog />
      <AccountFormDialog />
      <UserFormDialog />
    </React.Fragment>
  );
}
