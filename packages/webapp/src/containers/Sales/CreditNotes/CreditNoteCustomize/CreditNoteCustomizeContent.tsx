import { useFormikContext } from 'formik';
import { ElementCustomize } from '../../../ElementCustomize/ElementCustomize';
import { CreditNoteCustomizeGeneralField } from './CreditNoteCustomizeGeneralFields';
import { CreditNoteCustomizeContentFields } from './CreditNoteCutomizeContentFields';
import { CreditNotePaperTemplate } from './CreditNotePaperTemplate';
import { CreditNoteCustomizeValues } from './types';
import { initialValues } from './constants';
import { BrandingTemplateForm } from '@/containers/BrandingTemplates/BrandingTemplateForm';
import { useDrawerActions } from '@/hooks/state';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';

export function CreditNoteCustomizeContent() {
  const { payload, name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const templateId = payload?.templateId || null;

  const handleSuccess = () => {
    closeDrawer(name);
  };

  return (
    <BrandingTemplateForm<CreditNoteCustomizeValues>
      resource={'CreditNote'}
      templateId={templateId}
      defaultValues={initialValues}
      onSuccess={handleSuccess}
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
    </BrandingTemplateForm>
  );
}

function CreditNotePaperTemplateFormConnected() {
  const { values } = useFormikContext<CreditNoteCustomizeValues>();

  return <CreditNotePaperTemplate {...values} />;
}
