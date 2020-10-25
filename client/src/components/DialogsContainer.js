import React, { lazy } from 'react';

import AccountFormDialog from 'containers/Dialogs/AccountFormDialog';

// import UserFormDialog from 'containers/Dialogs/UserFormDialog';
// import ItemCategoryDialog from 'containers/Dialogs/ItemCategoryDialog';
// import CurrencyDialog from 'containers/Dialogs/CurrencyDialog';
// import InviteUserDialog from 'containers/Dialogs/InviteUserDialog';
// import ExchangeRateDialog from 'containers/Dialogs/ExchangeRateDialog';
import JournalNumberDialog from 'containers/Dialogs/JournalNumberDialog';
import BillNumberDialog from 'containers/Dialogs/BillNumberDialog';

export default function DialogsContainer() {
  return (
    <div>
      <AccountFormDialog dialogName={'account-form'} />
      <JournalNumberDialog dialogName={'journal-number-form'} />
      <BillNumberDialog dialogName={'bill-number-form'} />
    </div>
  );
}
