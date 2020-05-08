import React from 'react';
import AccountFormDialog from 'containers/Dialogs/AccountFormDialog';
import UserFormDialog from 'containers/Dialogs/UserFormDialog';
import ItemCategoryDialog from 'containers/Dialogs/ItemCategoryDialog';
import CurrencyDialog from 'containers/Dialogs/CurrencyDialog';
import InviteUserDialog from 'containers/Dialogs/InviteUserDialog';

export default function DialogsContainer() {
  return (
    <React.Fragment>
      <InviteUserDialog />
      <CurrencyDialog />
      <ItemCategoryDialog />
      <AccountFormDialog />
      <UserFormDialog />
    </React.Fragment>
  );
}
