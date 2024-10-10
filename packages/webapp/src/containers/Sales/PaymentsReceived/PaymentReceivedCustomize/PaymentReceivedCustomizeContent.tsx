import { useFormikContext } from 'formik';
import {
  ElementCustomize,
  ElementCustomizeContent,
} from '../../../ElementCustomize/ElementCustomize';
import { PaymentReceivedCustomizeGeneralField } from './PaymentReceivedCustomizeFieldsGeneral';
import { PaymentReceivedCustomizeContentFields } from './PaymentReceivedCustomizeFieldsContent';
import {
  PaymentReceivedCustomizeValues,
  PaymentReceivedPreviewState,
} from './types';
import {
  PaymentReceivedPaperTemplate,
  PaymentReceivedPaperTemplateProps,
} from './PaymentReceivedPaperTemplate';
import { initialValues } from './constants';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';
import { BrandingTemplateForm } from '@/containers/BrandingTemplates/BrandingTemplateForm';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';
import { useIsTemplateNamedFilled } from '@/containers/BrandingTemplates/utils';

export function PaymentReceivedCustomizeContent() {
  const { payload, name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const templateId = payload?.templateId || null;

  const handleSuccess = () => {
    closeDrawer(name);
  };

  return (
    <BrandingTemplateForm<
      PaymentReceivedCustomizeValues,
      PaymentReceivedPreviewState
    >
      templateId={templateId}
      defaultValues={initialValues}
      onSuccess={handleSuccess}
      resource={'PaymentReceive'}
    >
      <PaymentReceivedCustomizeFormContent />
    </BrandingTemplateForm>
  );
}

function PaymentReceivedCustomizeFormContent() {
  const isTemplateNameFilled = useIsTemplateNamedFilled();

  return (
    <ElementCustomizeContent>
      <ElementCustomize.PaperTemplate>
        <PaymentReceivedPaperTemplateFormConnected />
      </ElementCustomize.PaperTemplate>

      <ElementCustomize.FieldsTab id={'general'} label={'General'}>
        <PaymentReceivedCustomizeGeneralField />
      </ElementCustomize.FieldsTab>

      <ElementCustomize.FieldsTab
        id={'content'}
        label={'Content'}
        tabProps={{ disabled: !isTemplateNameFilled }}
      >
        <PaymentReceivedCustomizeContentFields />
      </ElementCustomize.FieldsTab>
    </ElementCustomizeContent>
  );
}

function PaymentReceivedPaperTemplateFormConnected() {
  const { values } = useFormikContext<PaymentReceivedCustomizeValues>();
  const { brandingState } = useElementCustomizeContext();

  const paperTemplateProps: PaymentReceivedPaperTemplateProps = {
    ...brandingState,
    ...values,
  };

  return <PaymentReceivedPaperTemplate {...paperTemplateProps} />;
}
