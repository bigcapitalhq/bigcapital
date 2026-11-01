import { SendMailViewFormValues } from '../../Estimates/SendMailViewDrawer/_types';

export type CreditNoteSendMailFormValues = SendMailViewFormValues & {
  attachPdf?: boolean;
};
