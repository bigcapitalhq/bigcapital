import { useFormikContext } from 'formik';
import { SendViewPreviewHeader } from '../SendMailViewDrawer/SendMailViewPreviewHeader';
import { useEstimateSendMailBoot } from './EstimateSendMailBoot';
import { useSendEstimateMailSubject } from './hooks';
import { EstimateSendMailFormValues } from './_interfaces';

export function EstimateSendMailPreviewHeader() {
  const subject = useSendEstimateMailSubject();
  const { estimateMailState } = useEstimateSendMailBoot();
  const {
    values: { to, from },
  } = useFormikContext<EstimateSendMailFormValues>();

  return (
    <SendViewPreviewHeader
      companyName={estimateMailState?.companyName}
      customerName={estimateMailState?.customerName}
      subject={subject}
      from={from}
      to={to}
    />
  );
}
