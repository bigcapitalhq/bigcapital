import { Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { first, pick } from 'lodash';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import { useQuickPaymentReceiveContext } from './QuickPaymentReceiveFormProvider';
import type {
  QuickPaymentReceiveFormValues,
  QuickPaymentReceiveInvoice,
} from './types';
import { AppToaster } from '@/components';

interface ResponseError {
  type: string;
}

interface TransformErrorsArgs {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFieldError: any;
}

export const defaultInitialValues: QuickPaymentReceiveFormValues = {
  invoiceId: '',
  customerId: '',
  depositAccountId: '',
  paymentReceiveNo: '',
  paymentDate: moment(new Date()).format('YYYY-MM-DD'),
  referenceNo: '',
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

  if (getError('PAYMENT_RECEIVE_NO_EXISTS')) {
    setFieldError('paymentReceiveNo', intl.get('payment_number_is_not_unique'));
  }
  if (getError('PAYMENT_RECEIVE_NO_REQUIRED')) {
    setFieldError(
      'paymentReceiveNo',
      intl.get('payment_received_number_required'),
    );
  }
  if (getError('INVALID_PAYMENT_AMOUNT')) {
    setFieldError(
      'paymentAmount',
      intl.get('the_payment_amount_bigger_than_invoice_due_amount'),
    );
  }
  if (getError('PAYMENT_ACCOUNT_CURRENCY_INVALID')) {
    AppToaster.show({
      message: intl.get(
        'payment_Receive.error.payment_account_currency_invalid',
      ),
      intent: Intent.DANGER,
    });
  }
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext<QuickPaymentReceiveFormValues>();
  const { branches, isBranchesSuccess } = useQuickPaymentReceiveContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches?.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branchId', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

export const transformInvoiceToForm = (
  invoice: QuickPaymentReceiveInvoice | undefined,
) => {
  return {
    ...pick(invoice, ['customerId', 'currencyCode']),
    amount: invoice?.dueAmount,
    invoiceId: invoice?.id,
  };
};
