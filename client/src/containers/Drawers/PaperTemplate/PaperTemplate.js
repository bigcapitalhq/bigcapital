import React from 'react';
import PaperTemplateHeader from './PaperTemplateHeader';
import PaperTemplateTable from './PaperTemplateTable';
import PaperTemplateFooter from './PaperTemplateFooter';
import 'style/components/Drawer/DrawerTemplate.scss';

export default function PaperTemplate({ labels: propLabels }) {
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
  return (
    <div id={'page-size'}>
      <div className={'template'}>
        <PaperTemplateHeader defaultLabels={labels} />
        <PaperTemplateTable />
        <PaperTemplateFooter />
      </div>
    </div>
  );
}
