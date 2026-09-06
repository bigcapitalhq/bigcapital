import { SendMailViewFormValues } from '../SendMailViewDrawer/_types';

export type EstimateSendMailFormValues = SendMailViewFormValues & {
  attachPdf?: boolean;
};
