import { lazy, Suspense } from 'react';
import { Tab } from '@blueprintjs/core';
import { SendMailViewPreviewTabs } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewTabs';

const InvoiceMailReceiptPreviewConnected = lazy(() =>
  import('./InvoiceMailReceiptPreviewConnected').then((module) => ({
    default: module.InvoiceMailReceiptPreviewConnected,
  })),
);
const InvoiceSendPdfPreviewConnected = lazy(() =>
  import('./InvoiceSendPdfPreviewConnected').then((module) => ({
    default: module.InvoiceSendPdfPreviewConnected,
  })),
);

export function InvoiceSendMailPreview() {
  return (
    <SendMailViewPreviewTabs>
      <Tab
        id={'payment-page'}
        title={'Payment page'}
        panel={
          <Suspense>
            <InvoiceMailReceiptPreviewConnected />
          </Suspense>
        }
      />
      <Tab
        id="pdf-document"
        title={'PDF document'}
        panel={
          <Suspense>
            <InvoiceSendPdfPreviewConnected />
          </Suspense>
        }
      />
    </SendMailViewPreviewTabs>
  );
}
