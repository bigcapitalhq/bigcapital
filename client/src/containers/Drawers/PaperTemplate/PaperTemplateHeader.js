import React from 'react';
import { TemplateHeader, TemplateContent } from '../components';

export default function PaperTemplateHeader({
  defaultLabels,
  headerData: { referenceNo, amount, dueDate, date, billedTo },
}) {
  return (
    <>
      <TemplateHeader defaultLabels={defaultLabels} />
      <TemplateContent
        defaultLabels={defaultLabels}
        billedTo={billedTo}
        date={date}
        referenceNo={referenceNo}
        amount={amount}
        billedFrom={''}
        dueDate={dueDate}
      />
    </>
  );
}
