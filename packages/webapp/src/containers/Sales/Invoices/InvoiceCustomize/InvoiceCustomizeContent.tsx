import React, { lazy, Suspense } from 'react';
import * as R from 'ramda';
import { useFormikContext } from 'formik';
import { Spinner, Tab } from '@blueprintjs/core';
import {
  InvoicePaperTemplate,
  InvoicePaperTemplateProps,
} from './InvoicePaperTemplate';
import {
  ElementCustomize,
  ElementCustomizeContent,
} from '../../../ElementCustomize/ElementCustomize';
import { InvoiceCustomizeGeneralField } from './InvoiceCustomizeGeneralFields';
import { InvoiceCustomizeContentFields } from './InvoiceCutomizeContentFields';
import { InvoiceCustomizeFormValues, InvoiceCustomizeState } from './types';
import { InvoiceCustomizeSchema } from './InvoiceCustomizeForm.schema';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';
import { BrandingTemplateForm } from '@/containers/BrandingTemplates/BrandingTemplateForm';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';
import { initialValues } from './constants';
import { useIsTemplateNamedFilled } from '@/containers/BrandingTemplates/utils';
import { InvoiceCustomizeTabs } from './InvoiceCustomizeTabs';

const InvoicePaymentPagePreview = lazy(() =>
  import('@/containers/PaymentPortal/InvoicePaymentPagePreview').then(
    (module) => ({ default: module.InvoicePaymentPagePreview }),
  ),
);

const InvoiceMailReceiptPreview = lazy(() =>
  import(
    '@/containers/Sales/Invoices/InvoiceCustomize/InvoiceMailReceiptPreview'
  ).then((module) => ({ default: module.InvoiceMailReceiptPreview })),
);

/**
 * Invoice branding template customize.
 * @return {JSX.Element}
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
      <InvoiceCustomizeFormContent />
    </BrandingTemplateForm>
  );
}

/**
 * Invoice branding template customize preview and fields.
 * @returns {JSX.Element}
 */
function InvoiceCustomizeFormContent() {
  const isTemplateNameFilled = useIsTemplateNamedFilled();

  return (
    <ElementCustomizeContent>
      <ElementCustomize.PaperTemplate>
        <InvoiceCustomizeTabs
          defaultSelectedTabId={'pdf-document'}
          id={'customize-preview-tabs'}
          renderActiveTabPanelOnly
        >
          <Tab
            id="pdf-document"
            title={'PDF document'}
            panel={
              <Suspense fallback={<Spinner />}>
                <InvoicePaperTemplateFormConnected />
              </Suspense>
            }
          />
          <Tab
            id={'payment-page'}
            title={'Payment page'}
            panel={
              <Suspense fallback={<Spinner />}>
                <InvoicePaymentPagePreview />
              </Suspense>
            }
          />
          <Tab
            id={'email-receipt'}
            title={'Email receipt'}
            panel={
              <Suspense fallback={<Spinner />}>
                <InvoiceMailReceiptPreview mx={'auto'} />
              </Suspense>
            }
          />
        </InvoiceCustomizeTabs>
      </ElementCustomize.PaperTemplate>

      <ElementCustomize.FieldsTab id={'general'} label={'General'}>
        <InvoiceCustomizeGeneralField />
      </ElementCustomize.FieldsTab>

      <ElementCustomize.FieldsTab
        id={'content'}
        label={'Content'}
        tabProps={{ disabled: !isTemplateNameFilled }}
      >
        <InvoiceCustomizeContentFields />
      </ElementCustomize.FieldsTab>
    </ElementCustomizeContent>
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
    const { brandingState } = useElementCustomizeContext();

    const mergedProps: InvoicePaperTemplateProps = {
      ...brandingState,
      ...values,
    };
    return <Component {...(props as P)} {...mergedProps} />;
  };
};

export const InvoicePaperTemplateFormConnected = R.compose(
  withInvoicePreviewTemplateProps,
)(InvoicePaperTemplate);
