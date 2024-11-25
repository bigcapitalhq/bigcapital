import { lazy } from 'react';
import { Suspense } from 'react';
import { Tab } from '@blueprintjs/core';
import { SendMailViewPreviewTabs } from '../SendMailViewDrawer/SendMailViewPreviewTabs';

const EstimateSendPdfPreviewConnected = lazy(() =>
  import('./EstimateSendPdfPreviewConnected').then((module) => ({
    default: module.EstimateSendPdfPreviewConnected,
  })),
);
const EstimateSendMailReceiptPreview = lazy(() =>
  import('./EstimateSendMailReceiptPreview').then((module) => ({
    default: module.EstimateSendMailReceiptPreview,
  })),
);

export function EstimateSendMailPreviewTabs() {
  return (
    <SendMailViewPreviewTabs>
      <Tab
        id={'payment-page'}
        title={'Payment page'}
        panel={
          <Suspense>
            <EstimateSendMailReceiptPreview />
          </Suspense>
        }
      />
      <Tab
        id="pdf-document"
        title={'PDF document'}
        panel={
          <Suspense>
            <EstimateSendPdfPreviewConnected />
          </Suspense>
        }
      />
    </SendMailViewPreviewTabs>
  );
}
