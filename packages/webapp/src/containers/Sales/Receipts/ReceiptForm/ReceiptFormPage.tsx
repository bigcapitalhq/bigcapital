// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';

import '@/style/pages/SaleReceipt/PageForm.scss';

import ReceiptFrom from './ReceiptForm';
import { ReceiptFormProvider } from './ReceiptFormProvider';
import { AutoExchangeRateProvider } from '@/containers/Entries/AutoExchangeProvider';

/**
 * Receipt form page.
 */
export default function ReceiptFormPage() {
  const { id } = useParams();
  const idInt = parseInt(id, 10);

  return (
    <ReceiptFormProvider receiptId={idInt}>
      <AutoExchangeRateProvider>
        <ReceiptFrom />
      </AutoExchangeRateProvider>
    </ReceiptFormProvider>
  );
}
