import React from 'react';
import PaperTemplateHeader from './PaperTemplateHeader';
import PaperTemplateTable from './PaperTemplateTable';
import PaperTemplateFooter from './PaperTemplateFooter';
import { updateItemsEntriesTotal } from 'containers/Entries/utils';
import { formatMessage } from 'services/intl';

import 'style/components/Drawer/DrawerTemplate.scss';

function PaperTemplate({ labels: propLabels, paperData, entries }) {
  const labels = {
    name: formatMessage({ id: 'estimate_' }),
    billedTo: formatMessage({ id: 'billed_to' }),
    date: formatMessage({ id: 'estimate_date' }),
    refNo: formatMessage({ id: 'estimate_no' }),
    billedFrom: formatMessage({ id: 'billed_from' }),
    amount: formatMessage({ id: 'estimate_amount' }),
    dueDate: formatMessage({ id: 'due_date_' }),
    ...propLabels,
  };

  const defaultValues = {
    billedTo: paperData.customer.display_name,
    date: paperData.estimate_date,
    amount: '',
    billedFrom: '',
    dueDate: paperData.expiration_date,
    referenceNo: paperData.estimate_number,
    ...paperData,
  };

  return (
    <div id={'page-size'}>
      <div className={'template'}>
        <PaperTemplateHeader
          defaultLabels={labels}
          headerData={defaultValues}
        />
        <PaperTemplateTable
          tableData={updateItemsEntriesTotal(entries)}
          currencyCode={paperData.currency_code}
        />
        <PaperTemplateFooter footerData={defaultValues} />
      </div>
    </div>
  );
}

export default PaperTemplate;
