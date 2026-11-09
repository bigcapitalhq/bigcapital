import {
  ReceiptPaperTemplate,
  ReceiptPaperTemplateProps,
} from '@bigcapital/pdf-templates';
import { useFormikContext } from 'formik';
import { initialValues } from './constants';
import { ReceiptCustomizeFieldsContent } from './ReceiptCustomizeFieldsContent';
import { ReceiptCustomizeGeneralField } from './ReceiptCustomizeFieldsGeneral';
import { ReceiptBrandingState, ReceiptCustomizeValues } from './types';
import { Box } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { BrandingTemplateForm } from '@/containers/BrandingTemplates/BrandingTemplateForm';
import { useIsTemplateNamedFilled } from '@/containers/BrandingTemplates/utils';
import {
  ElementCustomize,
  ElementCustomizeContent,
} from '@/containers/ElementCustomize/ElementCustomize';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';
import {
  paperTemplatePreviewStyle,
  pickPaperTemplateProps,
} from '@/containers/ElementCustomize/paperTemplatePreview';
import { useDrawerActions } from '@/hooks/state';

export function ReceiptCustomizeContent() {
  const { payload, name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();
  const templateId = payload?.templateId || null;

  const handleFormSuccess = () => {
    closeDrawer(name);
  };

  return (
    <BrandingTemplateForm<ReceiptCustomizeValues, ReceiptBrandingState>
      resource={'SaleReceipt'}
      templateId={templateId}
      defaultValues={initialValues}
      onSuccess={handleFormSuccess}
    >
      <ReceiptCustomizeFormContent />
    </BrandingTemplateForm>
  );
}

function ReceiptCustomizeFormContent() {
  const isTemplateNameFilled = useIsTemplateNamedFilled();

  return (
    <ElementCustomizeContent>
      <ElementCustomize.PaperTemplate>
        <Box overflow="auto" flex="1 1" px={4} py={6}>
          <ReceiptPaperTemplateFormConnected />
        </Box>
      </ElementCustomize.PaperTemplate>

      <ElementCustomize.FieldsTab id={'general'} label={'General'}>
        <ReceiptCustomizeGeneralField />
      </ElementCustomize.FieldsTab>

      <ElementCustomize.FieldsTab
        id={'content'}
        label={'Content'}
        tabProps={{ disabled: !isTemplateNameFilled }}
      >
        <ReceiptCustomizeFieldsContent />
      </ElementCustomize.FieldsTab>
    </ElementCustomizeContent>
  );
}

function ReceiptPaperTemplateFormConnected() {
  const { values } = useFormikContext<ReceiptCustomizeValues>();
  const { brandingState } = useElementCustomizeContext();

  const mergedProps = pickPaperTemplateProps<ReceiptPaperTemplateProps>(
    { ...brandingState, ...values },
    initialValues,
  );

  return (
    <ReceiptPaperTemplate {...mergedProps} style={paperTemplatePreviewStyle} />
  );
}
