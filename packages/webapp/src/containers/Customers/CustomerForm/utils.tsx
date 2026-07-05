// @ts-nocheck
import React from 'react';
import moment from 'moment';
import { useFormikContext } from 'formik';
import { first } from 'lodash';

import { useCustomerFormContext } from './CustomerFormProvider';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

export const defaultInitialValues = {
  customer_type: 'business',
  salutation: '',
  first_name: '',
  last_name: '',
  company_name: '',
  display_name: '',
  code: '',

  email: '',
  work_phone: '',
  personal_phone: '',
  website: '',
  note: '',
  active: true,

  billing_address_country: '',
  billing_address1: '',
  billing_address2: '',
  billing_address_city: '',
  billing_address_state: '',
  billing_address_postcode: '',
  billing_address_phone: '',

  shipping_address_country: '',
  shipping_address1: '',
  shipping_address2: '',
  shipping_address_city: '',
  shipping_address_state: '',
  shipping_address_postcode: '',
  shipping_address_phone: '',

  currency_code: '',

  opening_balance: '',
  withholding_tax_rate: '',
  opening_balance_at: moment(new Date()).format('YYYY-MM-DD'),
  opening_balance_exchange_rate: '',
  opening_balance_branch_id: '',
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = useCustomerFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('opening_balance_branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

/**
 * Detarmines whether the current customer has foreign currency.
 * @returns {boolean}
 */
export const useIsCustomerForeignCurrency = () => {
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const { values } = useFormikContext();

  return baseCurrency !== values.currency_code;
};

/**
 * Detarmines the exchange opening balance field when should update.
 */
export const openingBalanceFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.shouldUpdateDeps.currencyCode !==
      oldProps.shouldUpdateDeps.currencyCode ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};
