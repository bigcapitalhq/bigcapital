// @ts-nocheck
import React from 'react';
import moment from 'moment';
import { useFormikContext } from 'formik';
import { first } from 'lodash';

import { useCustomerFormContext } from './CustomerFormProvider';
import { useCurrentOrganization } from '@/hooks/state';

export const defaultInitialValues = {
  customer_type: 'business',
  salutation: '',
  first_name: '',
  last_name: '',
  company_name: '',
  display_name: '',

  email: '',
  work_phone: '',
  personal_phone: '',
  website: '',
  note: '',
  active: true,

  billing_address_country: '',
  billing_address_1: '',
  billing_address_2: '',
  billing_address_city: '',
  billing_address_state: '',
  billing_address_postcode: '',
  billing_address_phone: '',

  shipping_address_country: '',
  shipping_address_1: '',
  shipping_address_2: '',
  shipping_address_city: '',
  shipping_address_state: '',
  shipping_address_postcode: '',
  shipping_address_phone: '',

  currency_code: '',

  opening_balance: '',
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
 * Determines whether the current customer has foreign currency. 
 * @returns {boolean}
 */
export const useIsCustomerForeignCurrency = () => {
  const currentOrganization = useCurrentOrganization();
  const { values } = useFormikContext();

  return currentOrganization.base_currency !== values.currency_code;
};

/**
 * Determines the exchange opening balance field when should update.
 */
export const openingBalanceFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.shouldUpdateDeps.currencyCode !==
      oldProps.shouldUpdateDeps.currencyCode ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};
