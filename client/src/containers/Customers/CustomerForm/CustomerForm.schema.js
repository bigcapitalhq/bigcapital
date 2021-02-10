import * as Yup from 'yup';
import { formatMessage } from 'services/intl';


const Schema = Yup.object().shape({
    customer_type: Yup.string()
      .required()
      .trim()
      .label(formatMessage({ id: 'customer_type_' })),
    salutation: Yup.string().trim(),
    first_name: Yup.string().trim(),
    last_name: Yup.string().trim(),
    company_name: Yup.string().trim(),
    display_name: Yup.string()
      .trim()
      .required()
      .label(formatMessage({ id: 'display_name_' })),

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
    billing_address_postcode: Yup.number().nullable(),
    billing_address_phone: Yup.number(),

    shipping_address_country: Yup.string().trim(),
    shipping_address_1: Yup.string().trim(),
    shipping_address_2: Yup.string().trim(),
    shipping_address_city: Yup.string().trim(),
    shipping_address_state: Yup.string().trim(),
    shipping_address_postcode: Yup.number().nullable(),
    shipping_address_phone: Yup.number(),

    opening_balance: Yup.number().nullable(),
    currency_code: Yup.string(),
    opening_balance_at: Yup.date(),
  });

export const CreateCustomerForm = Schema;
export const EditCustomerForm = Schema;