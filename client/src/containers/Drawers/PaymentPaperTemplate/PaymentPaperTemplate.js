import React from 'react';
import PaymentPaperTemplateHeader from './PaymentPaperTemplateHeader';
import PaymentPaperTemplateTable from './PaymentPaperTemplateTable';

import 'style/components/Drawer/DrawerTemplate.scss';

export default function PaymentPaperTemplate({
  labels: propLabels,
  paperData,
}) {
  const labels = {
    name: 'Payment receive',
    billedTo: 'Billed to',
    date: 'Payment date',
    refNo: 'Payment No.',
    billedFrom: 'Billed from',
    referenceNo: 'Reference No',
    amount: 'Amount received',
    dueDate: 'Due date',
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
          <PaymentPaperTemplateTable tableData={entries} />
        </div>
      ))}
    </div>
  );
}
