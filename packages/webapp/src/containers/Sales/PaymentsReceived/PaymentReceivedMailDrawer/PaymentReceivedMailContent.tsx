import { Classes } from '@blueprintjs/core';
import { SendMailViewHeader } from '../../Estimates/SendMailViewDrawer/SendMailViewHeader';
import { SendMailViewLayout } from '../../Estimates/SendMailViewDrawer/SendMailViewLayout';
import { PaymentReceivedSendMailBoot } from './PaymentReceivedMailBoot';
import { PaymentReceivedSendMailFields } from './PaymentReceivedMailFields';
import { PaymentReceivedSendMailForm } from './PaymentReceivedMailForm';
import { PaymentReceivedSendMailPreview } from './PaymentReceivedMailPreviewTabs';
import { Stack } from '@/components';

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
