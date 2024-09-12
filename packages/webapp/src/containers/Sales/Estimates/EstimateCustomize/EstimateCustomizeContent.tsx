import { Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { Box } from '@/components';
import { ElementCustomize } from '../../../ElementCustomize/ElementCustomize';
import { EstimateCustomizeGeneralField } from './EstimateCustomizeFieldsGeneral';
import { EstimateCustomizeContentFields } from './EstimateCustomizeFieldsContent';
import { EstimatePaperTemplate } from './EstimatePaperTemplate';
import { EstimateCustomizeValues } from './types';
import { initialValues } from './constants';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';
import { BrandingTemplateForm } from '@/containers/BrandingTemplates/BrandingTemplateForm';

export function EstimateCustomizeContent() {
  const { payload, name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const templateId = payload?.templateId || null;

  const handleSuccess = () => {
    closeDrawer(name);
  };

  return (
    <BrandingTemplateForm<EstimateCustomizeValues>
      templateId={templateId}
      defaultValues={initialValues}
      onSuccess={handleSuccess}
      resource={'SaleEstimate'}
    >
      <ElementCustomize.PaperTemplate>
        <EstimatePaperTemplateFormConnected />
      </ElementCustomize.PaperTemplate>

      <ElementCustomize.FieldsTab id={'general'} label={'General'}>
        <EstimateCustomizeGeneralField />
      </ElementCustomize.FieldsTab>

      <ElementCustomize.FieldsTab id={'content'} label={'Content'}>
        <EstimateCustomizeContentFields />
      </ElementCustomize.FieldsTab>

      <ElementCustomize.FieldsTab id={'totals'} label={'Totals'}>
        asdfasdfdsaf #3
      </ElementCustomize.FieldsTab>
    </BrandingTemplateForm>
  );
}

function EstimatePaperTemplateFormConnected() {
  const { values } = useFormikContext<EstimateCustomizeValues>();

  return <EstimatePaperTemplate {...values} />;
}
