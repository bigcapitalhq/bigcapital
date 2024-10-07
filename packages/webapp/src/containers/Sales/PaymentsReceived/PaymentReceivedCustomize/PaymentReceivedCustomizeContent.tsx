import { useFormikContext } from 'formik';
import { ElementCustomize } from '../../../ElementCustomize/ElementCustomize';
import { PaymentReceivedCustomizeGeneralField } from './PaymentReceivedCustomizeFieldsGeneral';
import { PaymentReceivedCustomizeContentFields } from './PaymentReceivedCustomizeFieldsContent';
import { PaymentReceivedCustomizeValues, PaymentReceivedPreviewState } from './types';
import { PaymentReceivedPaperTemplate, PaymentReceivedPaperTemplateProps } from './PaymentReceivedPaperTemplate';
import { initialValues } from './constants';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';
import { BrandingTemplateForm } from '@/containers/BrandingTemplates/BrandingTemplateForm';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';

export function PaymentReceivedCustomizeContent() {
  const { payload, name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const templateId = payload?.templateId || null;

  const handleSuccess = () => {
    closeDrawer(name);
  };

  return (
    <BrandingTemplateForm<PaymentReceivedCustomizeValues, PaymentReceivedPreviewState>
      templateId={templateId}
      defaultValues={initialValues}
      onSuccess={handleSuccess}
      resource={'PaymentReceive'}
    >
      <ElementCustomize.PaperTemplate>
        <PaymentReceivedPaperTemplateFormConnected />
      </ElementCustomize.PaperTemplate>

      <ElementCustomize.FieldsTab id={'general'} label={'General'}>
        <PaymentReceivedCustomizeGeneralField />
      </ElementCustomize.FieldsTab>

      <ElementCustomize.FieldsTab id={'content'} label={'Content'}>
        <PaymentReceivedCustomizeContentFields />
      </ElementCustomize.FieldsTab>
    </BrandingTemplateForm>
  );
}

function PaymentReceivedPaperTemplateFormConnected() {
  const { values } = useFormikContext<PaymentReceivedCustomizeValues>();
  const { brandingState } = useElementCustomizeContext();

  const paperTemplateProps: PaymentReceivedPaperTemplateProps = { ...brandingState, ...values };

  return <PaymentReceivedPaperTemplate {...paperTemplateProps} />;
}
