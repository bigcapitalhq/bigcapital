import React from 'react';

import '@/style/components/Drawers/DrawerTemplate.scss';

import PaymentPaperTemplateHeader from './PaymentPaperTemplateHeader';
import PaymentPaperTemplateTable from './PaymentPaperTemplateTable';
import intl from 'react-intl-universal';


export default function PaymentPaperTemplate({
  labels: propLabels,
  paperData,
}) {
  const labels = {
    name: intl.get('payment_receive'),
    billedTo: intl.get('billed_to'),
    date: intl.get('payment_date_'),
    refNo: intl.get('payment_no'),
    billedFrom: intl.get('billed_from'),
    referenceNo: intl.get('reference_no'),
    amount: intl.get('amount_received'),
    dueDate: intl.get('due_date_'),
    ...propLabels,
  };
  const defaultValues = {
    billedTo: paperData.customer.display_name,
    date: paperData.payment_date,
    amount: '',
    billedFrom: '',
    referenceNo: paperData.payment_receive_no,
    ...paperData,
  };

  return (
    <div id={'page-size'}>
      {[defaultValues].map(({ entries, ...defaultValues }) => (
        <div className={'template'}>
          <PaymentPaperTemplateHeader
            defaultLabels={labels}
            headerData={defaultValues}
          />
          <PaymentPaperTemplateTable
            tableData={entries}
            currencyCode={paperData.currency_code}
          />
        </div>
      ))}
    </div>
  );
}
