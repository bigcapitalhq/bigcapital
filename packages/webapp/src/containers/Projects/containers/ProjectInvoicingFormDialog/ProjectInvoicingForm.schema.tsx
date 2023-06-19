// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';

const Schema = Yup.object().shape({
  date: Yup.date()
    .label(intl.get('project_invoicing.schema.label.date'))
    .required(),
  time: Yup.boolean(),
  unbilled: Yup.boolean(),
  bills: Yup.boolean(),
});

export const CreateProjectInvoicingFormSchema = Schema;
