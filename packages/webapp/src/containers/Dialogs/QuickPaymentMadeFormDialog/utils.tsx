import { Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { first, pick } from 'lodash';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import { useQuickPaymentMadeContext } from './QuickPaymentMadeFormProvider';
import type { QuickPaymentMadeBill, QuickPaymentMadeFormValues } from './types';
import { AppToaster } from '@/components';
import { PAYMENT_MADE_ERRORS } from '@/containers/Purchases/PaymentsMade/constants';

interface ResponseError {
  type: string;
}

interface TransformErrorsArgs {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFieldError: any;
}

// Default initial values of payment made.
export const defaultPaymentMade: QuickPaymentMadeFormValues = {
  billId: '',
  vendorId: '',
  paymentAccountId: '',
  paymentDate: moment(new Date()).format('YYYY-MM-DD'),
  reference: '',
  paymentNumber: '',
  amount: '',
  // statement: '',
  exchangeRate: 1,
  branchId: '',
};

export const transformErrors = (
  errors: ResponseError[],
  { setFieldError }: TransformErrorsArgs,
) => {
  const getError = (errorType: string) =>
    errors.find((e) => e.type === errorType);

  if (getError(PAYMENT_MADE_ERRORS.PAYMENT_NUMBER_NOT_UNIQUE)) {
    setFieldError('paymentNumber', intl.get('payment_number_is_not_unique'));
  }
  if (getError(PAYMENT_MADE_ERRORS.INVALID_BILL_PAYMENT_AMOUNT)) {
    setFieldError(
      'paymentAmount',
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
  const { setFieldValue } = useFormikContext<QuickPaymentMadeFormValues>();
  const { branches, isBranchesSuccess } = useQuickPaymentMadeContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches?.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branchId', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

export const transformBillToForm = (bill: QuickPaymentMadeBill | undefined) => {
  return {
    ...pick(bill, ['vendorId', 'currencyCode']),
    amount: bill?.dueAmount,
    billId: bill?.id,
  };
};
