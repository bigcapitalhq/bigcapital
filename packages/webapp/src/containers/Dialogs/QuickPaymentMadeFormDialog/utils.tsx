// @ts-nocheck
import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import { first } from 'lodash';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from '@/components';
import { useFormikContext } from 'formik';
import { useQuickPaymentMadeContext } from './QuickPaymentMadeFormProvider';
import { PAYMENT_MADE_ERRORS } from '@/containers/Purchases/PaymentsMade/constants';

// Default initial values of payment made.
export const defaultPaymentMade = {
  vendor_id: '',
  payment_account_id: '',
  payment_date: moment(new Date()).format('YYYY-MM-DD'),
  reference: '',
  payment_number: '',
  // statement: '',
  exchange_rate: 1,
  branch_id: '',
  entries: [{ bill_id: '', payment_amount: '' }],
};

export const transformErrors = (errors, { setFieldError }) => {
  const getError = (errorType) => errors.find((e) => e.type === errorType);

  if (getError(PAYMENT_MADE_ERRORS.PAYMENT_NUMBER_NOT_UNIQUE)) {
    setFieldError('payment_number', intl.get('payment_number_is_not_unique'));
  }
  if (getError(PAYMENT_MADE_ERRORS.INVALID_BILL_PAYMENT_AMOUNT)) {
    setFieldError(
      'payment_amount',
      intl.get('the_payment_amount_bigger_than_invoice_due_amount'),
    );
  }
  if (getError(PAYMENT_MADE_ERRORS.WITHDRAWAL_ACCOUNT_CURRENCY_INVALID)) {
    AppToaster.show({
      message: intl.get(
        'payment_made.error.withdrawal_account_currency_invalid',
      ),
      intent: Intent.DANGER,
    });
  }
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = useQuickPaymentMadeContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};
