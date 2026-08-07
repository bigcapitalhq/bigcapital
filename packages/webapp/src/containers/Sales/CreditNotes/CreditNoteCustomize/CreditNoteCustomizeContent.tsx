import { useFormikContext } from 'formik';
import {
  ElementCustomize,
  ElementCustomizeContent,
} from '../../../ElementCustomize/ElementCustomize';
import { initialValues } from './constants';
import { CreditNoteCustomizeGeneralField } from './CreditNoteCustomizeGeneralFields';
import { CreditNoteCustomizeContentFields } from './CreditNoteCutomizeContentFields';
import {
  CreditNotePaperTemplate,
  CreditNotePaperTemplateProps,
} from './CreditNotePaperTemplate';
import { CreditNoteBrandingState, CreditNoteCustomizeValues } from './types';
import { Box } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { BrandingTemplateForm } from '@/containers/BrandingTemplates/BrandingTemplateForm';
import { useIsTemplateNamedFilled } from '@/containers/BrandingTemplates/utils';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';
import { useDrawerActions } from '@/hooks/state';

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
        <Box overflow="auto" flex="1 1" px={4} py={6}>
          <CreditNotePaperTemplateFormConnected />
        </Box>
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
