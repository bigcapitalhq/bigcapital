import { Classes } from '@blueprintjs/core';
import { SendMailViewHeader } from '../SendMailViewDrawer/SendMailViewHeader';
import { SendMailViewLayout } from '../SendMailViewDrawer/SendMailViewLayout';
import { EstimateSendMailBoot } from './EstimateSendMailBoot';
import { EstimateSendMailForm } from './EstimateSendMailForm';
import { EstimateSendMailPreviewTabs } from './EstimateSendMailPreview';
import { EstimateSendMailFields } from './EstimateSnedMailFields';
import { Stack } from '@/components';

export function EstimateSendMailContent() {
  return (
    <Stack className={Classes.DRAWER_BODY}>
      <EstimateSendMailBoot>
        <EstimateSendMailForm>
          <SendMailViewLayout
            header={<SendMailViewHeader label={'Send Estimate Mail'} />}
            fields={<EstimateSendMailFields />}
            preview={<EstimateSendMailPreviewTabs />}
          />
        </EstimateSendMailForm>
      </EstimateSendMailBoot>
    </Stack>
  );
}
