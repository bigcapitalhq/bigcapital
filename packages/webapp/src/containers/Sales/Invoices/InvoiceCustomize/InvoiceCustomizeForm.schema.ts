import * as Yup from 'yup';

export const InvoiceCustomizeSchema = Yup.object().shape({
  templateName: Yup.string().required('Template Name is required'),
});
