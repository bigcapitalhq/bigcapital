import { Stack } from '@/components';
import { Classes } from '@blueprintjs/core';
import { PaymentReceivedSendMailBoot } from './PaymentReceivedMailBoot';
import { PaymentReceivedSendMailForm } from './PaymentReceivedMailForm';
import { PaymentReceivedSendMailPreview } from './PaymentReceivedMailPreviewTabs';
import { SendMailViewHeader } from '../../Estimates/SendMailViewDrawer/SendMailViewHeader';
import { SendMailViewLayout } from '../../Estimates/SendMailViewDrawer/SendMailViewLayout';
import { PaymentReceivedSendMailFields } from './PaymentReceivedMailFields';

export function PaymentReceivedSendMailContent() {
  return (
    <Stack className={Classes.DRAWER_BODY}>
      <PaymentReceivedSendMailBoot>
        <PaymentReceivedSendMailForm>
          <SendMailViewLayout
            header={<SendMailViewHeader label={'Send Payment Mail'} />}
            fields={<PaymentReceivedSendMailFields />}
            preview={<PaymentReceivedSendMailPreview />}
          />
        </PaymentReceivedSendMailForm>
      </PaymentReceivedSendMailBoot>
    </Stack>
  );
}
