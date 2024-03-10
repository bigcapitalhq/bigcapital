// @ts-nocheck
import * as Yup from 'yup';

export const InvoiceMailFormSchema = Yup.object().shape({
  from: Yup.array().required().min(1).max(5).label('From address'),
  to: Yup.array().required().min(1).max(5).label('To address'),
  subject: Yup.string().required().label('Mail subject'),
  body: Yup.string().required().label('Mail body'),
});
