import { Tab, Tabs } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Stack } from '@/components';
import { InvoiceMailReceiptPreviewConneceted } from './InvoiceMailReceiptPreviewConnected.';
import { InvoiceSendPdfPreviewConnected } from './InvoiceSendPdfPreviewConnected';

export function InvoiceSendMailPreview() {
  return (
    <Stack bg="#F5F5F5" flex={'1'} maxHeight={'100%'} minWidth="850px">
      <Tabs
        id={'preview'}
        defaultSelectedTabId={'payment-page'}
        className={css`
          overflow: hidden;
          flex: 1 1;
          display: flex;
          flex-direction: column;

          .bp4-tab-list {
            padding: 0 20px;
            background: #fff;
            border-bottom: 1px solid #dcdcdd;
          }
          .bp4-tab {
            line-height: 40px;
          }
          .bp4-tab:not([aria-selected='true']) {
            color: #5f6b7c;
          }
          .bp4-tab-indicator-wrapper .bp4-tab-indicator {
            height: 2px;
          }
          .bp4-tab-panel {
            margin: 0;
            overflow: auto;
          }
        `}
      >
        <Tab
          id={'payment-page'}
          title={'Payment page'}
          panel={<InvoiceMailReceiptPreviewConneceted />}
        />
        <Tab
          id="pdf-document"
          title={'PDF document'}
          panel={<InvoiceSendPdfPreviewConnected />}
        />
      </Tabs>
    </Stack>
  );
}
