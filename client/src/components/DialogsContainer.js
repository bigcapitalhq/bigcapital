import React, { lazy } from 'react';

import AccountFormDialog from 'containers/Dialogs/AccountFormDialog';

// import UserFormDialog from 'containers/Dialogs/UserFormDialog';
// import ItemCategoryDialog from 'containers/Dialogs/ItemCategoryDialog';
// import CurrencyDialog from 'containers/Dialogs/CurrencyDialog';
// import InviteUserDialog from 'containers/Dialogs/InviteUserDialog';
// import ExchangeRateDialog from 'containers/Dialogs/ExchangeRateDialog';
import JournalNumberDialog from 'containers/Dialogs/JournalNumberDialog';
import BillNumberDialog from 'containers/Dialogs/BillNumberDialog';
import PaymentNumberDialog from 'containers/Dialogs/PaymentNumberDialog';
import EstimateNumberDialog from 'containers/Dialogs/EstimateNumberDialog';
import ReceiptNumberDialog from 'containers/Dialogs/ReceiptNumberDialog';
import InvoiceNumberDialog from 'containers/Dialogs/InvoiceNumberDialog';
export default function DialogsContainer() {
  return (
    <div>
      <AccountFormDialog dialogName={'account-form'} />
      <JournalNumberDialog dialogName={'journal-number-form'} />
      <BillNumberDialog dialogName={'bill-number-form'} />
      <PaymentNumberDialog dialogName={'payment-number-form'} />
      <EstimateNumberDialog dialogName={'estimate-number-form'} />
      <ReceiptNumberDialog dialogName={'receipt-number-form'} />
      <InvoiceNumberDialog dialogName={'invoice-number-form'} />
    </div>
  );
}
