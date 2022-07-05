import React from 'react';

import '@/style/components/Drawers/DrawerTemplate.scss';

import PaperTemplateHeader from './PaperTemplateHeader';
import PaperTemplateTable from './PaperTemplateTable';
import PaperTemplateFooter from './PaperTemplateFooter';
import { updateItemsEntriesTotal } from '@/containers/Entries/utils';
import intl from 'react-intl-universal';


function PaperTemplate({ labels: propLabels, paperData, entries }) {
  const labels = {
    name: intl.get('estimate_'),
    billedTo: intl.get('billed_to'),
    date: intl.get('estimate_date'),
    refNo: intl.get('estimate_no'),
    billedFrom: intl.get('billed_from'),
    amount: intl.get('estimate_amount'),
    dueDate: intl.get('due_date_'),
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
