import { Box } from '@/components';
import { Classes } from '@blueprintjs/core';
import { ElementCustomize } from '../../../ElementCustomize/ElementCustomize';
import { ReceiptCustomizeGeneralField } from './ReceiptCustomizeFieldsGeneral';
import { ReceiptCustomizeFieldsContent } from './ReceiptCustomizeFieldsContent';
import { ReceiptPaperTemplate } from './ReceiptPaperTemplate';
import { ReceiptCustomizeValues } from './types';
import { initialValues } from './constants';
import { useFormikContext } from 'formik';

export default function ReceiptCustomizeContent() {
  const handleFormSubmit = (values: ReceiptCustomizeValues) => {};

  return (
    <Box className={Classes.DRAWER_BODY}>
      <ElementCustomize<ReceiptCustomizeValues>
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <ElementCustomize.PaperTemplate>
          <ReceiptPaperTemplateFormConnected />
        </ElementCustomize.PaperTemplate>

        <ElementCustomize.FieldsTab id={'general'} label={'General'}>
          <ReceiptCustomizeGeneralField />
        </ElementCustomize.FieldsTab>

        <ElementCustomize.FieldsTab id={'content'} label={'Content'}>
          <ReceiptCustomizeFieldsContent />
        </ElementCustomize.FieldsTab>

        <ElementCustomize.FieldsTab id={'totals'} label={'Totals'}>
          asdfasdfdsaf #3
        </ElementCustomize.FieldsTab>
      </ElementCustomize>
    </Box>
  );
}

function ReceiptPaperTemplateFormConnected() {
  const { values } = useFormikContext<ReceiptCustomizeValues>();

  return <ReceiptPaperTemplate {...values} />;
}
