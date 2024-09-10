import React from 'react';
import { Box } from '@/components';
import { Classes } from '@blueprintjs/core';
import { ElementCustomize } from '../../../ElementCustomize/ElementCustomize';
import { PaymentReceivedCustomizeGeneralField } from './PaymentReceivedCustomizeFieldsGeneral';
import { PaymentReceivedCustomizeContentFields } from './PaymentReceivedCustomizeFieldsContent';
import { PaymentReceivedCustomizeValues } from './types';
import { initialValues } from './constants';

export default function PaymentReceivedCustomizeContent() {
  const handleFormSubmit = (values: PaymentReceivedCustomizeValues) => {};

  return (
    <Box className={Classes.DRAWER_BODY}>
      <ElementCustomize<PaymentReceivedCustomizeValues>
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        {/* <ElementCustomize.PaperTemplate>
          <InvoicePaperTemplate />
        </ElementCustomize.PaperTemplate> */}

        <ElementCustomize.FieldsTab id={'general'} label={'General'}>
          <PaymentReceivedCustomizeGeneralField />
        </ElementCustomize.FieldsTab>

        <ElementCustomize.FieldsTab id={'content'} label={'Content'}>
          <PaymentReceivedCustomizeContentFields />
        </ElementCustomize.FieldsTab>

        <ElementCustomize.FieldsTab id={'totals'} label={'Totals'}>
          asdfasdfdsaf #3
        </ElementCustomize.FieldsTab>
      </ElementCustomize>
    </Box>
  );
}
