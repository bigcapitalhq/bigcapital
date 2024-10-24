import { Group, Stack } from '@/components';
import { Classes } from '@blueprintjs/core';
import { InvoiceSendMailBoot } from './InvoiceSendMailContentBoot';
import { InvoiceSendMailForm } from './InvoiceSendMailForm';
import { InvoiceSendMailHeader } from './InvoiceSendMailHeader';
import { InvoiceSendMailPreview } from './InvoiceSendMailPreview';
import { InvoiceSendMailFields } from './InvoiceSendMailFields';

export function InvoiceSendMailContent() {
  return (
    <Stack className={Classes.DRAWER_BODY}>
      <InvoiceSendMailBoot>
        <InvoiceSendMailForm>
          <Stack spacing={0} flex={1} overflow="hidden">
            <InvoiceSendMailHeader label={'Send Invoice Mail'} />

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
