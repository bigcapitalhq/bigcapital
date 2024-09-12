import { useFormikContext } from 'formik';
import { ElementCustomize } from '../../../ElementCustomize/ElementCustomize';
import { CreditNoteCustomizeGeneralField } from './CreditNoteCustomizeGeneralFields';
import { CreditNoteCustomizeContentFields } from './CreditNoteCutomizeContentFields';
import { CreditNotePaperTemplate } from './CreditNotePaperTemplate';
import { CreditNoteCustomizeValues } from './types';
import { initialValues } from './constants';

export function CreditNoteCustomizeContent() {
  const handleFormSubmit = (values: CreditNoteCustomizeValues) => {};

  return (
    <ElementCustomize<CreditNoteCustomizeValues>
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <ElementCustomize.PaperTemplate>
        <CreditNotePaperTemplateFormConnected />
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
  );
}

function CreditNotePaperTemplateFormConnected() {
  const { values } = useFormikContext<CreditNoteCustomizeValues>();

  return <CreditNotePaperTemplate {...values} />;
}
