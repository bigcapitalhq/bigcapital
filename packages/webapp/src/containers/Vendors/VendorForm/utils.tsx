import { useFormikContext } from 'formik';
import { first } from 'lodash';
import moment from 'moment';
import React from 'react';
import type {
  CreateVendorBody,
  EditVendorBody,
  Vendor,
} from '@bigcapital/sdk-ts';
import { useVendorFormContext } from './VendorFormProvider';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import {
  defaultFastFieldShouldUpdate,
  parseBoolean,
  transformToForm,
} from '@/utils';

export type VendorFormValues = {
  salutation: string;
  firstName: string;
  lastName: string;
  companyName: string;
  displayName: string;
  displayNameFormat: string;
  code: string;

  email: string;
  workPhone: string;
  personalPhone: string;
  website: string;
  note: string;
  active: boolean | string;

  billingAddressCountry: string;
  billingAddress1: string;
  billingAddress2: string;
  billingAddressCity: string;
  billingAddressState: string;
  billingAddressPostcode: string;
  billingAddressPhone: string;

  shippingAddressCountry: string;
  shippingAddress1: string;
  shippingAddress2: string;
  shippingAddressCity: string;
  shippingAddressState: string;
  shippingAddressPostcode: string;
  shippingAddressPhone: string;

  currencyCode: string;

  openingBalance: string | number;
  openingBalanceAt: string;
  openingBalanceExchangeRate: string | number;
  openingBalanceBranchId: string | number;
};

export const defaultInitialValues: VendorFormValues = {
  salutation: '',
  firstName: '',
  lastName: '',
  companyName: '',
  displayName: '',
  displayNameFormat: '',
  code: '',

  email: '',
  workPhone: '',
  personalPhone: '',
  website: '',
  note: '',
  active: true,

  billingAddressCountry: '',
  billingAddress1: '',
  billingAddress2: '',
  billingAddressCity: '',
  billingAddressState: '',
  billingAddressPostcode: '',
  billingAddressPhone: '',

  shippingAddressCountry: '',
  shippingAddress1: '',
  shippingAddress2: '',
  shippingAddressCity: '',
  shippingAddressState: '',
  shippingAddressPostcode: '',
  shippingAddressPhone: '',

  currencyCode: '',

  openingBalance: '',
  openingBalanceAt: moment(new Date()).format('YYYY-MM-DD'),
  openingBalanceBranchId: '',
  openingBalanceExchangeRate: '',
};

const toNumber = (value: string | number): number | undefined => {
  if (value === '' || value === null || value === undefined) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

/**
 * Transforms a vendor (API response) to form initial values.
 * Drops `openingBalanceAt` from contact-duplicate sources to avoid prefilling stale dates.
 */
export const transformVendorToForm = (
  vendor: Partial<Vendor> | null | undefined,
  defaults: VendorFormValues,
): VendorFormValues =>
  ({
    ...transformToForm(vendor ?? {}, defaults),
    active: vendor?.active ?? defaults.active,
  }) as VendorFormValues;

/**
 * Merges partial form overrides on top of defaults (used for initialValues prop).
 */
export const transformValuesToForm = (
  values: Partial<VendorFormValues>,
  defaults: VendorFormValues,
): Partial<VendorFormValues> => transformToForm(values, defaults);

/**
 * Coerces form values into the create-vendor request body.
 */
export const transformFormToCreateRequest = (
  values: VendorFormValues,
): CreateVendorBody => ({
  currencyCode: values.currencyCode,
  active: parseBoolean(values.active, true),
  openingBalanceExchangeRate: toNumber(values.openingBalanceExchangeRate) ?? 1,

  salutation: values.salutation,
  firstName: values.firstName,
  lastName: values.lastName,
  companyName: values.companyName,
  displayName: values.displayName,
  code: values.code,
  website: values.website,
  email: values.email,
  workPhone: values.workPhone,
  personalPhone: values.personalPhone,
  note: values.note,

  billingAddress1: values.billingAddress1,
  billingAddress2: values.billingAddress2,
  billingAddressCity: values.billingAddressCity,
  billingAddressCountry: values.billingAddressCountry,
  billingAddressPostcode: values.billingAddressPostcode,
  billingAddressPhone: values.billingAddressPhone,
  billingAddressState: values.billingAddressState,

  shippingAddress1: values.shippingAddress1,
  shippingAddress2: values.shippingAddress2,
  shippingAddressCity: values.shippingAddressCity,
  shippingAddressCountry: values.shippingAddressCountry,
  shippingAddressPostcode: values.shippingAddressPostcode,
  shippingAddressPhone: values.shippingAddressPhone,
  shippingAddressState: values.shippingAddressState,

  openingBalance: toNumber(values.openingBalance),
  openingBalanceAt: values.openingBalanceAt,
  openingBalanceBranchId: toNumber(values.openingBalanceBranchId),
});

/**
 * Coerces form values into the edit-vendor request body (no currency/opening balance).
 */
export const transformFormToEditRequest = (
  values: VendorFormValues,
): EditVendorBody => ({
  active: parseBoolean(values.active, true),

  salutation: values.salutation,
  firstName: values.firstName,
  lastName: values.lastName,
  companyName: values.companyName,
  displayName: values.displayName,
  code: values.code,
  website: values.website,
  email: values.email,
  workPhone: values.workPhone,
  personalPhone: values.personalPhone,
  note: values.note,

  billingAddress1: values.billingAddress1,
  billingAddress2: values.billingAddress2,
  billingAddressCity: values.billingAddressCity,
  billingAddressCountry: values.billingAddressCountry,
  billingAddressPostcode: values.billingAddressPostcode,
  billingAddressPhone: values.billingAddressPhone,
  billingAddressState: values.billingAddressState,

  shippingAddress1: values.shippingAddress1,
  shippingAddress2: values.shippingAddress2,
  shippingAddressCity: values.shippingAddressCity,
  shippingAddressCountry: values.shippingAddressCountry,
  shippingAddressPostcode: values.shippingAddressPostcode,
  shippingAddressPhone: values.shippingAddressPhone,
  shippingAddressState: values.shippingAddressState,
});

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext<VendorFormValues>();
  const { branches, isBranchesSuccess } = useVendorFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('openingBalanceBranchId', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

/**
 * Determines whether the current vendor uses a foreign currency.
 */
export const useIsVendorForeignCurrency = () => {
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const { values } = useFormikContext<VendorFormValues>();

  return Boolean(baseCurrency) && baseCurrency !== values.currencyCode;
};

type OpeningBalanceFieldProps = {
  shouldUpdateDeps?: { currencyCode?: string };
  [key: string]: unknown;
};

/**
 * Determines whether the opening balance fast-field should re-render.
 */
export const openingBalanceFieldShouldUpdate = (
  newProps: OpeningBalanceFieldProps,
  oldProps: OpeningBalanceFieldProps,
): boolean =>
  newProps.shouldUpdateDeps?.currencyCode !==
    oldProps.shouldUpdateDeps?.currencyCode ||
  defaultFastFieldShouldUpdate(newProps, oldProps);
