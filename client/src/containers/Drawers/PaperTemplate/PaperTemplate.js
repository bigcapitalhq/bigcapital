import React from 'react';
import PaperTemplateHeader from './PaperTemplateHeader';
import PaperTemplateTable from './PaperTemplateTable';
import PaperTemplateFooter from './PaperTemplateFooter';
import { updateItemsEntriesTotal } from 'containers/Entries/utils';

import 'style/components/Drawer/DrawerTemplate.scss';

function PaperTemplate({ labels: propLabels, paperData, entries }) {
  const labels = {
    name: 'Estimate',
    billedTo: 'Billed to',
    date: 'Estimate date',
    refNo: 'Estimate No.',
    billedFrom: 'Billed from',
    amount: 'Estimate amount',
    dueDate: 'Due date',
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
