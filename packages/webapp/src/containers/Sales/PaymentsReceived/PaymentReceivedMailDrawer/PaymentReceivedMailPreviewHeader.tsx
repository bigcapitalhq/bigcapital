import { useFormikContext } from 'formik';
import { SendViewPreviewHeader } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewHeader';
import { usePaymentReceivedMailSubject } from './_hooks';
import { PaymentReceivedSendMailFormValues } from './_types';
import { usePaymentReceivedSendMailBoot } from './PaymentReceivedMailBoot';

export function PaymentReceivedMailPreviewHeader() {
  const subject = usePaymentReceivedMailSubject();
  const { paymentReceivedMailState } = usePaymentReceivedSendMailBoot();
  const {
    values: { from, to },
  } = useFormikContext<PaymentReceivedSendMailFormValues>();

  return (
    <SendViewPreviewHeader
      companyName={paymentReceivedMailState?.companyName || ''}
      customerName={paymentReceivedMailState?.customerName || ''}
      subject={subject}
      from={from}
      to={to}
    />
  );
}
