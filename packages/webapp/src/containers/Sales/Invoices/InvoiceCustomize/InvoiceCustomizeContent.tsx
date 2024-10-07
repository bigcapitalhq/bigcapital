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
import { InvoiceCustomizeFormValues, InvoiceCustomizeState } from './types';
import { InvoiceCustomizeSchema } from './InvoiceCustomizeForm.schema';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';
import { BrandingTemplateForm } from '@/containers/BrandingTemplates/BrandingTemplateForm';
import { initialValues } from './constants';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';

/**
 * Invoice branding template customize.
 */
export function InvoiceCustomizeContent() {
  const { payload, name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();
  const templateId = payload?.templateId || null;

  const handleSuccess = () => {
    closeDrawer(name);
  };

  return (
    <BrandingTemplateForm<InvoiceCustomizeFormValues, InvoiceCustomizeState>
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

/**
 * Injects the `InvoicePaperTemplate` component props from the form and branding states.
 * @param Component 
 * @returns {JSX.Element}
 */
const withInvoicePreviewTemplateProps = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return (props: Omit<P, keyof InvoicePaperTemplateProps>) => {
    const { values } = useFormikContext<InvoiceCustomizeFormValues>();
    const { brandingState, } = useElementCustomizeContext();

    const mergedProps: InvoicePaperTemplateProps = { ...brandingState, ...values }

    return <Component {...(props as P)} {...mergedProps} />;
  };
};

export const InvoicePaperTemplateFormConnected =
  R.compose(withInvoicePreviewTemplateProps)(InvoicePaperTemplate);
