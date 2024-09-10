import React from 'react';
import { Box } from '@/components';
import { Classes } from '@blueprintjs/core';
// import { InvoicePaperTemplate } from './InvoicePaperTemplate';
import { ElementCustomize } from '../../../ElementCustomize/ElementCustomize';
import { CreditNoteCustomizeGeneralField } from './CreditNoteCustomizeGeneralFields';
import { CreditNoteCustomizeContentFields } from './CreditNoteCutomizeContentFields';
import { CreditNotePaperTemplate } from './CreditNotePaperTemplate';
import { CreditNoteCustomizeValues } from './types';
import { initialValues } from './constants';

export default function CreditNoteCustomizeContent() {
  const handleFormSubmit = (values: CreditNoteCustomizeValues) => {};

  return (
    <Box className={Classes.DRAWER_BODY}>
      <ElementCustomize<CreditNoteCustomizeValues>
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <ElementCustomize.PaperTemplate>
          <CreditNotePaperTemplate />
        </ElementCustomize.PaperTemplate>

        <ElementCustomize.FieldsTab id={'general'} label={'General'}>
          <CreditNoteCustomizeGeneralField />
        </ElementCustomize.FieldsTab>

        <ElementCustomize.FieldsTab id={'content'} label={'Content'}>
          <CreditNoteCustomizeContentFields />
        </ElementCustomize.FieldsTab>

        <ElementCustomize.FieldsTab id={'totals'} label={'Totals'}>
          asdfasdfdsaf #3
        </ElementCustomize.FieldsTab>
      </ElementCustomize>
    </Box>
  );
}
