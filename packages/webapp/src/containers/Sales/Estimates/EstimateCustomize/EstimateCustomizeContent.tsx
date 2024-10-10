import { useFormikContext } from 'formik';
import {
  ElementCustomize,
  ElementCustomizeContent,
} from '../../../ElementCustomize/ElementCustomize';
import { EstimateCustomizeGeneralField } from './EstimateCustomizeFieldsGeneral';
import { EstimateCustomizeContentFields } from './EstimateCustomizeFieldsContent';
import {
  EstimatePaperTemplate,
  EstimatePaperTemplateProps,
} from './EstimatePaperTemplate';
import { EstimateBrandingState, EstimateCustomizeValues } from './types';
import { initialValues } from './constants';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';
import { BrandingTemplateForm } from '@/containers/BrandingTemplates/BrandingTemplateForm';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';
import { useIsTemplateNamedFilled } from '@/containers/BrandingTemplates/utils';

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
        <EstimatePaperTemplateFormConnected />
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
