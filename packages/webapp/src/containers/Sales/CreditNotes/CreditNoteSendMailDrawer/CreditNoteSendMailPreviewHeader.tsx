import { useFormikContext } from 'formik';
import { SendViewPreviewHeader } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewHeader';
import { CreditNoteSendMailFormValues } from './_types';
import { useCreditNoteSendMailBoot } from './CreditNoteSendMailBoot';
import { useSendCreditNoteMailSubject } from './hooks';

export function CreditNoteSendMailPreviewHeader() {
  const subject = useSendCreditNoteMailSubject();
  const { creditNoteMailState } = useCreditNoteSendMailBoot();
  const {
    values: { to, from },
  } = useFormikContext<CreditNoteSendMailFormValues>();

  return (
    <SendViewPreviewHeader
      companyName={creditNoteMailState?.companyName}
      customerName={creditNoteMailState?.customerName}
      subject={subject}
      from={from}
      to={to}
    />
  );
}
