import { useFormikContext } from 'formik';
import { ElementCustomize } from '@/containers/ElementCustomize/ElementCustomize';
import { ReceiptCustomizeGeneralField } from './ReceiptCustomizeFieldsGeneral';
import { ReceiptCustomizeFieldsContent } from './ReceiptCustomizeFieldsContent';
import { ReceiptPaperTemplate, ReceiptPaperTemplateProps } from './ReceiptPaperTemplate';
import { EstimateBrandingState, ReceiptCustomizeValues } from './types';
import { initialValues } from './constants';
import { BrandingTemplateForm } from '@/containers/BrandingTemplates/BrandingTemplateForm';
import { useDrawerActions } from '@/hooks/state';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';

export function ReceiptCustomizeContent() {
  const { payload, name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();
  const templateId = payload?.templateId || null;

  const handleFormSuccess = () => {
    closeDrawer(name);
  };

  return (
    <BrandingTemplateForm<ReceiptCustomizeValues, EstimateBrandingState>
      resource={'SaleReceipt'}
      templateId={templateId}
      defaultValues={initialValues}
      onSuccess={handleFormSuccess}
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
    </BrandingTemplateForm>
  );
}

function ReceiptPaperTemplateFormConnected() {
  const { values } = useFormikContext<ReceiptCustomizeValues>();
  const { brandingState } = useElementCustomizeContext();

  const mergedProps: ReceiptPaperTemplateProps = { ...brandingState, ...values, };

  return <ReceiptPaperTemplate {...mergedProps} />;
}
