import { Classes } from '@blueprintjs/core';
import { SendMailViewHeader } from '../../Estimates/SendMailViewDrawer/SendMailViewHeader';
import { SendMailViewLayout } from '../../Estimates/SendMailViewDrawer/SendMailViewLayout';
import { InvoiceSendMailBoot } from './InvoiceSendMailContentBoot';
import { InvoiceSendMailFields } from './InvoiceSendMailFields';
import { InvoiceSendMailForm } from './InvoiceSendMailForm';
import { InvoiceSendMailPreview } from './InvoiceSendMailPreview';
import { Stack } from '@/components';

export function InvoiceSendMailContent() {
  return (
    <Stack className={Classes.DRAWER_BODY}>
      <InvoiceSendMailBoot>
        <InvoiceSendMailForm>
          <SendMailViewLayout
            header={<SendMailViewHeader label={'Send Invoice Mail'} />}
            fields={<InvoiceSendMailFields />}
            preview={<InvoiceSendMailPreview />}
          />
        </InvoiceSendMailForm>
      </InvoiceSendMailBoot>
    </Stack>
  );
}
