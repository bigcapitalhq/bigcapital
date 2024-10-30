export interface InvoiceSendMailFormValues {
  subject: string;
  message: string;
  to: string[];
  cc: string[];
  bcc: string[];
  attachPdf: boolean;
}
