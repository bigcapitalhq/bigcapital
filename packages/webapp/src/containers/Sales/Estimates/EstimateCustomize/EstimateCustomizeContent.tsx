import React from 'react';
import { Box } from '@/components';
import { Classes } from '@blueprintjs/core';
import { ElementCustomize } from '../../../ElementCustomize/ElementCustomize';
import { EstimateCustomizeGeneralField } from './EstimateCustomizeFieldsGeneral';
import { EstimateCustomizeContentFields } from './EstimateCustomizeFieldsContent';
import { EstimatePaperTemplate } from './EstimatePaperTemplate';
import { EstimateCustomizeValues } from './types';
import { initialValues } from './constants';
import { useFormikContext } from 'formik';

export default function EstimateCustomizeContent() {
  const handleFormSubmit = (values: EstimateCustomizeValues) => {};

  return (
    <Box className={Classes.DRAWER_BODY}>
      <ElementCustomize<EstimateCustomizeValues>
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <ElementCustomize.PaperTemplate>
          <EstimatePaperTemplateFormConnected />
        </ElementCustomize.PaperTemplate>

        <ElementCustomize.FieldsTab id={'general'} label={'General'}>
          <EstimateCustomizeGeneralField />
        </ElementCustomize.FieldsTab>

        <ElementCustomize.FieldsTab id={'content'} label={'Content'}>
          <EstimateCustomizeContentFields />
        </ElementCustomize.FieldsTab>

        <ElementCustomize.FieldsTab id={'totals'} label={'Totals'}>
          asdfasdfdsaf #3
        </ElementCustomize.FieldsTab>
      </ElementCustomize>
    </Box>
  );
}

function EstimatePaperTemplateFormConnected() {
  const { values } = useFormikContext<EstimateCustomizeValues>();

  return <EstimatePaperTemplate {...values} />;
}
