import React from 'react';
import * as R from 'ramda';
import { useFormikContext } from 'formik';
import {
  InvoicePaperTemplate,
  InvoicePaperTemplateProps,
} from './InvoicePaperTemplate';
import { ElementCustomize } from '../../../ElementCustomize/ElementCustomize';
import { InvoiceCustomizeGeneralField } from './InvoiceCustomizeGeneralFields';
import { InvoiceCustomizeContentFields } from './InvoiceCutomizeContentFields';
import { InvoiceCustomizeValues } from './types';
import { InvoiceCustomizeSchema } from './InvoiceCustomizeForm.schema';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';
import { BrandingTemplateForm } from '@/containers/BrandingTemplates/BrandingTemplateForm';
import { initialValues } from './constants';

export function InvoiceCustomizeContent() {
  const { payload, name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();
  const templateId = payload?.templateId || null;

  const handleSuccess = () => {
    closeDrawer(name);
  };

  return (
    <BrandingTemplateForm<InvoiceCustomizeValues>
      templateId={templateId}
      defaultValues={initialValues}
      validationSchema={InvoiceCustomizeSchema}
      onSuccess={handleSuccess}
      resource={'SaleInvoice'}
    >
      <ElementCustomize.PaperTemplate>
        <InvoicePaperTemplateFormConnected />
      </ElementCustomize.PaperTemplate>

      <ElementCustomize.FieldsTab id={'general'} label={'General'}>
        <InvoiceCustomizeGeneralField />
      </ElementCustomize.FieldsTab>

      <ElementCustomize.FieldsTab id={'content'} label={'Content'}>
        <InvoiceCustomizeContentFields />
      </ElementCustomize.FieldsTab>
    </BrandingTemplateForm>
  );
}

const withFormikProps = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return (props: Omit<P, keyof InvoicePaperTemplateProps>) => {
    const { values } = useFormikContext<InvoicePaperTemplateProps>();

    return <Component {...(props as P)} {...values} />;
  };
};

export const InvoicePaperTemplateFormConnected =
  R.compose(withFormikProps)(InvoicePaperTemplate);
