import { Classes } from '@blueprintjs/core';
import { EstimateSendMailBoot } from './EstimateSendMailBoot';
import { Stack } from '@/components';
import { EstimateSendMailForm } from './EstimateSendMailForm';
import { SendMailViewHeader } from '../SendMailViewDrawer/SendMailViewHeader';
import { SendMailViewLayout } from '../SendMailViewDrawer/SendMailViewLayout';
import { EstimateSendMailFields } from './EstimateSnedMailFields';
import { EstimateSendMailPreviewTabs } from './EstimateSendMailPreview';

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
