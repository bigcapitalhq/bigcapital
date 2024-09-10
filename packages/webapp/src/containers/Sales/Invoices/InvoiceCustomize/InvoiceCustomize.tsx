import React from 'react';
import { Box } from '@/components';
import { Classes } from '@blueprintjs/core';
import { InvoicePaperTemplate } from './InvoicePaperTemplate';
import { ElementCustomize } from '../../../ElementCustomize/ElementCustomize';
import { InvoiceCustomizeGeneralField } from './InvoiceCustomizeGeneralFields';
import { InvoiceCustomizeContentFields } from './InvoiceCutomizeContentFields';
import { InvoiceCustomizeValues } from './types';
import { initialValues } from './constants';

export default function InvoiceCustomizeContent() {
  const handleFormSubmit = (values: InvoiceCustomizeValues) => {};

  return (
    <Box className={Classes.DRAWER_BODY}>
      <ElementCustomize<InvoiceCustomizeValues>
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <ElementCustomize.PaperTemplate>
          <InvoicePaperTemplate />
        </ElementCustomize.PaperTemplate>

        <ElementCustomize.FieldsTab id={'general'} label={'General'}>
          <InvoiceCustomizeGeneralField />
        </ElementCustomize.FieldsTab>

        <ElementCustomize.FieldsTab id={'content'} label={'Content'}>
          <InvoiceCustomizeContentFields />
        </ElementCustomize.FieldsTab>

        <ElementCustomize.FieldsTab id={'totals'} label={'Totals'}>
          asdfasdfdsaf #3
        </ElementCustomize.FieldsTab>
      </ElementCustomize>
    </Box>
  );
}
