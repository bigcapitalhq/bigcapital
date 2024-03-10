// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';

const Schema = Yup.object().shape({
  customer_type: Yup.string()
    .required()
    .trim()
    .label(intl.get('customer_type_')),
  salutation: Yup.string().trim(),
  first_name: Yup.string().trim(),
  last_name: Yup.string().trim(),
  company_name: Yup.string().trim(),
  display_name: Yup.string()
    .trim()
    .required()
    .label(intl.get('display_name_')),

  email: Yup.string().email().nullable(),
  work_phone: Yup.number(),
  personal_phone: Yup.number(),
  website: Yup.string().url().nullable(),

  active: Yup.boolean(),
  note: Yup.string().trim(),

  billing_address_country: Yup.string().trim(),
  billing_address_1: Yup.string().trim(),
  billing_address_2: Yup.string().trim(),
  billing_address_city: Yup.string().trim(),
  billing_address_state: Yup.string().trim(),
  billing_address_postcode: Yup.string().nullable(),
  billing_address_phone: Yup.number(),

  shipping_address_country: Yup.string().trim(),
  shipping_address_1: Yup.string().trim(),
  shipping_address_2: Yup.string().trim(),
  shipping_address_city: Yup.string().trim(),
  shipping_address_state: Yup.string().trim(),
  shipping_address_postcode: Yup.string().nullable(),
  shipping_address_phone: Yup.number(),

  opening_balance: Yup.number().nullable(),
  currency_code: Yup.string(),
  opening_balance_at: Yup.date(),
  opening_balance_branch_id: Yup.string(),
});

export const CreateCustomerForm = Schema;
export const EditCustomerForm = Schema;
