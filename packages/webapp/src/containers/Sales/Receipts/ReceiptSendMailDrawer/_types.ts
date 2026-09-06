import { SendMailViewFormValues } from '../../Estimates/SendMailViewDrawer/_types';

export type ReceiptSendMailFormValues = SendMailViewFormValues & {
  attachPdf?: boolean;
};
