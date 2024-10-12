import { useFormikContext } from 'formik';
import {
  ElementCustomize,
  ElementCustomizeContent,
} from '../../../ElementCustomize/ElementCustomize';
import { CreditNoteCustomizeGeneralField } from './CreditNoteCustomizeGeneralFields';
import { CreditNoteCustomizeContentFields } from './CreditNoteCutomizeContentFields';
import {
  CreditNotePaperTemplate,
  CreditNotePaperTemplateProps,
} from './CreditNotePaperTemplate';
import { CreditNoteBrandingState, CreditNoteCustomizeValues } from './types';
import { initialValues } from './constants';
import { BrandingTemplateForm } from '@/containers/BrandingTemplates/BrandingTemplateForm';
import { useDrawerActions } from '@/hooks/state';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';
import { useIsTemplateNamedFilled } from '@/containers/BrandingTemplates/utils';

export function CreditNoteCustomizeContent() {
  const { payload, name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const templateId = payload?.templateId || null;

  const handleSuccess = () => {
    closeDrawer(name);
  };

  return (
    <BrandingTemplateForm<CreditNoteCustomizeValues, CreditNoteBrandingState>
      resource={'CreditNote'}
      templateId={templateId}
      defaultValues={initialValues}
      onSuccess={handleSuccess}
    >
      <CreditNoteCustomizeFormContent />
    </BrandingTemplateForm>
  );
}

function CreditNoteCustomizeFormContent() {
  const isTemplateNameFilled = useIsTemplateNamedFilled();

  return (
    <ElementCustomizeContent>
      <ElementCustomize.PaperTemplate>
        <CreditNotePaperTemplateFormConnected />
      </ElementCustomize.PaperTemplate>

      <ElementCustomize.FieldsTab id={'general'} label={'General'}>
        <CreditNoteCustomizeGeneralField />
      </ElementCustomize.FieldsTab>

      <ElementCustomize.FieldsTab
        id={'content'}
        label={'Content'}
        tabProps={{ disabled: !isTemplateNameFilled }}
      >
        <CreditNoteCustomizeContentFields />
      </ElementCustomize.FieldsTab>
    </ElementCustomizeContent>
  );
}

function CreditNotePaperTemplateFormConnected() {
  const { values } = useFormikContext<CreditNoteCustomizeValues>();
  const { brandingState } = useElementCustomizeContext();

  const mergedProps: CreditNotePaperTemplateProps = {
    ...brandingState,
    ...values,
  };

  return <CreditNotePaperTemplate {...mergedProps} />;
}
