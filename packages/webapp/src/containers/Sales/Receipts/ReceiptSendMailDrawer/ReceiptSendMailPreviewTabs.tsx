import { Suspense } from 'react';
import { Tab } from '@blueprintjs/core';
import { SendMailViewPreviewTabs } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewTabs';
import { ReceiptSendMailPreview } from './ReceiptSendMailPreview';
import { ReceiptSendMailPdfPreview } from './ReceiptSendMailPdfPreview';

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
