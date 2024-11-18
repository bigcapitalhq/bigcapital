import { Suspense } from 'react';
import { SendMailViewPreviewTabs } from '../SendMailViewDrawer/SendMailViewPreviewTabs';
import { Tab } from '@blueprintjs/core';
import { EstimateSendPdfPreviewConnected } from './EstimateSendPdfPreviewConnected';

export function EstimateSendMailPreviewTabs() {
  return (
    <SendMailViewPreviewTabs>
      <Tab
        id={'payment-page'}
        title={'Payment page'}
        panel={
          <Suspense>{/* <InvoiceMailReceiptPreviewConnected /> */}</Suspense>
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
