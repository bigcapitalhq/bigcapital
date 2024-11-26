import { lazy, Suspense } from 'react';
import { Tab } from '@blueprintjs/core';
import { SendMailViewPreviewTabs } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewTabs';

const ReceiptSendMailPreview = lazy(() =>
  import('./ReceiptSendMailPreview').then((module) => ({
    default: module.ReceiptSendMailPreview,
  })),
);
const ReceiptSendMailPdfPreview = lazy(() =>
  import('./ReceiptSendMailPdfPreview').then((module) => ({
    default: module.ReceiptSendMailPdfPreview,
  })),
);

export function ReceiptSendMailPreviewTabs() {
  return (
    <SendMailViewPreviewTabs>
      <Tab
        id={'payment-page'}
        title={'Payment page'}
        panel={
          <Suspense>
            <ReceiptSendMailPreview />
          </Suspense>
        }
      />
      <Tab
        id="pdf-document"
        title={'PDF document'}
        panel={
          <Suspense>
            <ReceiptSendMailPdfPreview />
          </Suspense>
        }
      />
    </SendMailViewPreviewTabs>
  );
}
