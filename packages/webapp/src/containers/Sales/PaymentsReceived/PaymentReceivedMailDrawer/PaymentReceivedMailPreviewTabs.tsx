import { lazy, Suspense } from 'react';
import { Tab } from '@blueprintjs/core';
import { SendMailViewPreviewTabs } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewTabs';

const PaymentReceivedMailPreviewReceipt = lazy(() =>
  import('./PaymentReceivedMailPreviewReceipt').then((module) => ({
    default: module.PaymentReceivedMailPreviewReceipt,
  })),
);
const PaymentReceivedSendMailPreviewPdf = lazy(() =>
  import('./PaymentReceivedMailPreviewPdf').then((module) => ({
    default: module.PaymentReceivedSendMailPreviewPdf,
  })),
);

export function PaymentReceivedSendMailPreview() {
  return (
    <SendMailViewPreviewTabs>
      <Tab
        id={'payment-page'}
        title={'Payment page'}
        panel={
          <Suspense>
            <PaymentReceivedMailPreviewReceipt />
          </Suspense>
        }
      />
      <Tab
        id="pdf-document"
        title={'PDF document'}
        panel={
          <Suspense>
            <PaymentReceivedSendMailPreviewPdf />
          </Suspense>
        }
      />
    </SendMailViewPreviewTabs>
  );
}
