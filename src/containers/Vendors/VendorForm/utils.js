import React from 'react';
import moment from 'moment';
import { useFormikContext } from 'formik';
import { first } from 'lodash';

import { useVendorFormContext } from './VendorFormProvider';

export const defaultInitialValues = {
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

  opening_balance: '',
  currency_code: '',
  opening_balance_at: moment(new Date()).format('YYYY-MM-DD'),
  opening_balance_branch_id: '',
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = useVendorFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('opening_balance_branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};
