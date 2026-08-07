import { useFormikContext } from 'formik';
import {
  ElementCustomize,
  ElementCustomizeContent,
} from '../../../ElementCustomize/ElementCustomize';
import { initialValues } from './constants';
import { EstimateCustomizeContentFields } from './EstimateCustomizeFieldsContent';
import { EstimateCustomizeGeneralField } from './EstimateCustomizeFieldsGeneral';
import {
  EstimatePaperTemplate,
  EstimatePaperTemplateProps,
} from './EstimatePaperTemplate';
import { EstimateBrandingState, EstimateCustomizeValues } from './types';
import { Box } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { BrandingTemplateForm } from '@/containers/BrandingTemplates/BrandingTemplateForm';
import { useIsTemplateNamedFilled } from '@/containers/BrandingTemplates/utils';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';
import { useDrawerActions } from '@/hooks/state';

export function EstimateCustomizeContent() {
  const { payload, name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();
  const templateId = payload?.templateId || null;

  const handleSuccess = () => {
    closeDrawer(name);
  };

  return (
    <BrandingTemplateForm<EstimateCustomizeValues, EstimateBrandingState>
      templateId={templateId}
      defaultValues={initialValues}
      onSuccess={handleSuccess}
      resource={'SaleEstimate'}
    >
      <EstimateCustomizeFormContent />
    </BrandingTemplateForm>
  );
}

function EstimateCustomizeFormContent() {
  const isTemplateNameFilled = useIsTemplateNamedFilled();

  return (
    <ElementCustomizeContent>
      <ElementCustomize.PaperTemplate>
        <Box overflow="auto" flex="1 1" px={4} py={6}>
          <EstimatePaperTemplateFormConnected />
        </Box>
      </ElementCustomize.PaperTemplate>

      <ElementCustomize.FieldsTab id={'general'} label={'General'}>
        <EstimateCustomizeGeneralField />
      </ElementCustomize.FieldsTab>

      <ElementCustomize.FieldsTab
        id={'content'}
        label={'Content'}
        tabProps={{ disabled: !isTemplateNameFilled }}
      >
        <EstimateCustomizeContentFields />
      </ElementCustomize.FieldsTab>
    </ElementCustomizeContent>
  );
}

/**
 * Injects the `EstimatePaperTemplate` component props from the form and branding states.
 * @returns {JSX.Element}
 */
function EstimatePaperTemplateFormConnected() {
  const { values } = useFormikContext<EstimateCustomizeValues>();
  const { brandingState } = useElementCustomizeContext();

  const mergedProps: EstimatePaperTemplateProps = {
    ...brandingState,
    ...values,
  };

  return <EstimatePaperTemplate {...mergedProps} />;
}
