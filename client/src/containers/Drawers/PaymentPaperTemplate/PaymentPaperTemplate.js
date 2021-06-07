import React from 'react';
import PaymentPaperTemplateHeader from './PaymentPaperTemplateHeader';
import PaymentPaperTemplateTable from './PaymentPaperTemplateTable';
import { formatMessage } from 'services/intl';

import 'style/components/Drawer/DrawerTemplate.scss';

export default function PaymentPaperTemplate({
  labels: propLabels,
  paperData,
}) {
  const labels = {
    name: formatMessage({ id: 'payment_receive' }),
    billedTo: formatMessage({ id: 'billed_to' }),
    date: formatMessage({ id: 'payment_date_' }),
    refNo: formatMessage({ id: 'payment_no' }),
    billedFrom: formatMessage({ id: 'billed_from' }),
    referenceNo: formatMessage({ id: 'reference_no' }),
    amount: formatMessage({ id: 'amount_received' }),
    dueDate: formatMessage({ id: 'due_date_' }),
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
