import React from 'react';
import { TemplateHeader, TemplateContent } from '../components';

export default function PaymentPaperTemplateHeader({
  defaultLabels,
  headerData: { referenceNo, amount, date, billedTo, currency_code },
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
        currencyCode={currency_code}
      />
    </>
  );
}
