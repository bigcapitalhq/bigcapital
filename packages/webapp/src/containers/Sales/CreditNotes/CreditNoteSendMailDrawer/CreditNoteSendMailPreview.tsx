import { Tab } from '@blueprintjs/core';
import { lazy } from 'react';
import { Suspense } from 'react';
import { SendMailViewPreviewTabs } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewTabs';

const CreditNoteSendPdfPreviewConnected = lazy(() =>
  import('./CreditNoteSendPdfPreviewConnected').then((module) => ({
    default: module.CreditNoteSendPdfPreviewConnected,
  })),
);
const CreditNoteSendMailReceiptPreview = lazy(() =>
  import('./CreditNoteSendMailReceiptPreview').then((module) => ({
    default: module.CreditNoteSendMailReceiptPreview,
  })),
);

export function CreditNoteSendMailPreviewTabs() {
  return (
    <SendMailViewPreviewTabs>
      <Tab
        id={'email-preview'}
        title={'Email preview'}
        panel={
          <Suspense>
            <CreditNoteSendMailReceiptPreview />
          </Suspense>
        }
      />
      <Tab
        id="pdf-document"
        title={'PDF document'}
        panel={
          <Suspense>
            <CreditNoteSendPdfPreviewConnected />
          </Suspense>
        }
      />
    </SendMailViewPreviewTabs>
  );
}
