import React from 'react';
import AccountFormDialog from 'containers/Dashboard/Dialogs/AccountFormDialog';
import UserFormDialog from 'containers/Dashboard/Dialogs/UserFormDialog';
import ItemCategoryDialog from 'containers/Dashboard/Dialogs/ItemCategoryDialog';

export default function DialogsContainer() {
  return (
    <React.Fragment>
      <ItemCategoryDialog />
      <AccountFormDialog />
      <UserFormDialog />
    </React.Fragment>
  );
}
