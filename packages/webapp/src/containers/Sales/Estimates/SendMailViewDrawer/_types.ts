export interface SendMailViewFormValues {
  from: Array<string>;
  to: Array<string>;
  cc: Array<string>;
  bcc: Array<string>;
  subject: string;
  message: string;
}
