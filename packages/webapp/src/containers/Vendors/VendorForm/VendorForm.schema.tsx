import intl from 'react-intl-universal';
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  salutation: Yup.string().trim(),
  firstName: Yup.string().trim(),
  lastName: Yup.string().trim(),
  companyName: Yup.string().trim(),
  displayName: Yup.string().trim(),
  code: Yup.string().trim(),

  email: Yup.string().email().nullable(),
  workPhone: Yup.string().nullable(),
  personalPhone: Yup.string().nullable(),
  website: Yup.string().url().nullable(),

  active: Yup.boolean(),
  note: Yup.string().trim(),

  billingAddressCountry: Yup.string().trim(),
  billingAddress1: Yup.string().trim(),
  billingAddress2: Yup.string().trim(),
  billingAddressCity: Yup.string().trim(),
  billingAddressState: Yup.string().trim(),
  billingAddressPostcode: Yup.string().nullable(),
  billingAddressPhone: Yup.string().nullable(),

  shippingAddressCountry: Yup.string().trim(),
  shippingAddress1: Yup.string().trim(),
  shippingAddress2: Yup.string().trim(),
  shippingAddressCity: Yup.string().trim(),
  shippingAddressState: Yup.string().trim(),
  shippingAddressPostcode: Yup.string().nullable(),
  shippingAddressPhone: Yup.string().nullable(),

  openingBalance: Yup.number().nullable(),
  currencyCode: Yup.string(),
  openingBalanceAt: Yup.date(),
  openingBalanceBranchId: Yup.mixed(),
  openingBalanceExchangeRate: Yup.number().nullable(),
});

export const CreateVendorFormSchema = Schema;
export const EditVendorFormSchema = Schema;
