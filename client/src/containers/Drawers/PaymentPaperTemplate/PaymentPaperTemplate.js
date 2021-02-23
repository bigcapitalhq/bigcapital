import React from 'react';
import PaymentPaperTemplateHeader from './PaymentPaperTemplateHeader';
import PaymentPaperTemplateTable from './PaymentPaperTemplateTable';
import 'style/components/Drawer/DrawerTemplate.scss';

export default function PaymentPaperTemplate({ labels: propLabels }) {
  const labels = {
    title: 'Payment receive',
    billedTo: 'Billed to',
    paymentDate: 'Payment date',
    paymentNo: 'Payment No.',
    billedFrom: 'Billed from',
    referenceNo: 'Reference No',
    amountReceived: 'Amount received',
    ...propLabels,
  };

  return (
    <div id={'page-size'}>
      <div className={'template'}>
        <PaymentPaperTemplateHeader defaultLabels={labels} />
        <PaymentPaperTemplateTable />
      </div>
    </div>
  );
}
