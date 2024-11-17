import { Group, Stack } from '@/components';
import { Classes } from '@blueprintjs/core';
import { InvoiceSendMailBoot } from './InvoiceSendMailContentBoot';
import { InvoiceSendMailForm } from './InvoiceSendMailForm';
import { InvoiceSendMailPreview } from './InvoiceSendMailPreview';
import { InvoiceSendMailFields } from './InvoiceSendMailFields';
import { SendMailViewHeader } from '../../Estimates/SendMailViewDrawer/SendMailViewHeader';

export function InvoiceSendMailContent() {
  return (
    <Stack className={Classes.DRAWER_BODY}>
      <InvoiceSendMailBoot>
        <InvoiceSendMailForm>
          <Stack spacing={0} flex={1} overflow="hidden">
            <SendMailViewHeader label={'Send Invoice Mail'} />

            <Group flex={1} overflow="auto" spacing={0} alignItems={'stretch'}>
              <InvoiceSendMailFields />
              <InvoiceSendMailPreview />
            </Group>
          </Stack>
        </InvoiceSendMailForm>
      </InvoiceSendMailBoot>
    </Stack>
  );
}
