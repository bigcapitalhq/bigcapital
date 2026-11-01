import { Classes } from '@blueprintjs/core';
import { SendMailViewHeader } from '../../Estimates/SendMailViewDrawer/SendMailViewHeader';
import { SendMailViewLayout } from '../../Estimates/SendMailViewDrawer/SendMailViewLayout';
import { CreditNoteSendMailBoot } from './CreditNoteSendMailBoot';
import { CreditNoteSendMailFields } from './CreditNoteSendMailFields';
import { CreditNoteSendMailForm } from './CreditNoteSendMailForm';
import { CreditNoteSendMailPreviewTabs } from './CreditNoteSendMailPreview';
import { Stack } from '@/components';

export function CreditNoteSendMailContent() {
  return (
    <Stack className={Classes.DRAWER_BODY}>
      <CreditNoteSendMailBoot>
        <CreditNoteSendMailForm>
          <SendMailViewLayout
            header={<SendMailViewHeader label={'Send Credit Note Mail'} />}
            fields={<CreditNoteSendMailFields />}
            preview={<CreditNoteSendMailPreviewTabs />}
          />
        </CreditNoteSendMailForm>
      </CreditNoteSendMailBoot>
    </Stack>
  );
}
