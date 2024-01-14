// @ts-nocheck
import { DialogsName } from '@/constants/dialogs';
import React from 'react';

const InvoiceExchangeRateChangeAlert = React.lazy(
  () => import('./InvoiceExchangeRateChangeDialog'),
);

const Dialogs = [
  {
    name: DialogsName.InvoiceExchangeRateChangeNotice,
    component: InvoiceExchangeRateChangeAlert,
  },
];

export default Dialogs;
