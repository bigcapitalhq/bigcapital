import { lazy, Suspense } from 'react';
import { Spinner, Tab } from '@blueprintjs/core';
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
import { initialValues } from './constants';
import { useIsTemplateNamedFilled } from '@/containers/BrandingTemplates/utils';
import { InvoiceCustomizeTabs } from './InvoiceCustomizeTabs';

const InvoiceCustomizePaymentPreview = lazy(() =>
  import('./InvoiceCustomizePaymentPreview').then((module) => ({
    default: module.InvoiceCustomizePaymentPreview,
  })),
);

const InvoiceCustomizeMailReceiptPreview = lazy(() =>
  import('./InvoiceCustomizeMailReceiptPreview').then((module) => ({
    default: module.InvoiceCustomizeMailReceiptPreview,
  })),
);

const InvoiceCustomizePdfPreview = lazy(() =>
  import('./InvoiceCustomizePdfPreview').then((module) => ({
    default: module.InvoiceCustomizePdfPreview,
  })),
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
                <InvoiceCustomizePdfPreview />
              </Suspense>
            }
          />
          <Tab
            id={'payment-page'}
            title={'Payment page'}
            panel={
              <Suspense fallback={<Spinner />}>
                <InvoiceCustomizePaymentPreview />
              </Suspense>
            }
          />
          <Tab
            id={'email-receipt'}
            title={'Email receipt'}
            panel={
              <Suspense fallback={<Spinner />}>
                <InvoiceCustomizeMailReceiptPreview mx={'auto'} />
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
