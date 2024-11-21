import { useFormikContext } from 'formik';
import { SendViewPreviewHeader } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewHeader';
import { useSendReceiptMailSubject } from './_hooks';
import { useReceiptSendMailBoot } from './ReceiptSendMailBoot';
import { ReceiptSendMailFormValues } from './_types';

export function ReceiptSendMailPreviewHeader() {
  const subject = useSendReceiptMailSubject();
  const { receiptMailState } = useReceiptSendMailBoot();
  const {
    values: { to, from },
  } = useFormikContext<ReceiptSendMailFormValues>();

  return (
    <SendViewPreviewHeader
      companyName={receiptMailState?.companyName || ''}
      customerName={receiptMailState?.customerName || ''}
      subject={subject}
      from={to}
      to={from}
    />
  );
}
