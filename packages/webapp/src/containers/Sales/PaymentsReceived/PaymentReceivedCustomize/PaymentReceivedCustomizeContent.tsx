import { useFormikContext } from 'formik';
import {
  ElementCustomize,
  ElementCustomizeContent,
} from '../../../ElementCustomize/ElementCustomize';
import { initialValues } from './constants';
import { PaymentReceivedCustomizeContentFields } from './PaymentReceivedCustomizeFieldsContent';
import { PaymentReceivedCustomizeGeneralField } from './PaymentReceivedCustomizeFieldsGeneral';
import {
  PaymentReceivedPaperTemplate,
  PaymentReceivedPaperTemplateProps,
} from './PaymentReceivedPaperTemplate';
import {
  PaymentReceivedCustomizeValues,
  PaymentReceivedPreviewState,
} from './types';
import { Box } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { BrandingTemplateForm } from '@/containers/BrandingTemplates/BrandingTemplateForm';
import { useIsTemplateNamedFilled } from '@/containers/BrandingTemplates/utils';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';
import { useDrawerActions } from '@/hooks/state';

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
        <Box overflow="auto" flex="1 1" px={4} py={6}>
          <PaymentReceivedPaperTemplateFormConnected />
        </Box>
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
