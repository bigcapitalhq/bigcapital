import { Intent } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import '@/style/pages/CashFlow/CashflowTransactionForm.scss';
import { useMoneyOutDialogContext } from './MoneyOutDialogProvider';
import { CreateMoneyOutSchema } from './MoneyOutForm.schema';
import { MoneyOutFormContent } from './MoneyOutFormContent';
import type { MoneyOutFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { CreateCashflowTransactionBody } from '@bigcapital/sdk-ts';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { useSettingCashFlow } from '@/hooks/query';
import { compose, transactionNumber } from '@/utils';

interface MoneyOutFormInnerProps
  extends Pick<WithDialogActionsProps, 'closeDialog'> {}

const defaultInitialValues: MoneyOutFormValues = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  amount: '',
  transactionNumber: '',
  transactionType: '',
  referenceNo: '',
  cashflowAccountId: '',
  creditAccountId: '',
  currencyCode: '',
  description: '',
  branchId: '',
  publish: '',
  exchangeRate: 1,
};

const toNumber = (v: string | number | undefined): number | undefined =>
  v == null || v === ''
    ? undefined
    : typeof v === 'number'
      ? v
      : Number(v) || undefined;

const transformToRequestBody = (
  values: MoneyOutFormValues,
): CreateCashflowTransactionBody => ({
  date: values.date,
  amount: toNumber(values.amount) ?? 0,
  transactionType: values.transactionType,
  referenceNo: values.referenceNo,
  description: values.description,
  exchangeRate: toNumber(values.exchangeRate) ?? 1,
  creditAccountId: toNumber(values.creditAccountId) ?? 0,
  cashflowAccountId: toNumber(values.cashflowAccountId) ?? 0,
  branchId: toNumber(values.branchId),
  publish: true,
});

function MoneyOutFormInner({
  // #withDialogActions
  closeDialog,
}: MoneyOutFormInnerProps) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const { data: cashflowSetting } = useSettingCashFlow();

  const transactionNextNumber = cashflowSetting?.nextNumber as
    | string
    | number
    | undefined;
  const transactionNumberPrefix = cashflowSetting?.numberPrefix as
    | string
    | undefined;
  const transactionIncrementMode = cashflowSetting?.autoIncrement as
    | boolean
    | undefined;

  const {
    dialogName,
    accountId,
    accountType,
    createCashflowTransactionMutate,
  } = useMoneyOutDialogContext();

  // transaction number.
  const transactionNo = transactionNumber(
    transactionNumberPrefix,
    transactionNextNumber,
  );

  // Initial form values.
  const initialValues: MoneyOutFormValues = {
    ...defaultInitialValues,
    currencyCode: baseCurrency ?? '',
    transactionType: accountType ?? '',
    ...(transactionIncrementMode && {
      transactionNumber: transactionNo,
    }),
    cashflowAccountId: accountId ?? '',
  };

  // Handles the form submit.
  const handleFormSubmit = (
    values: MoneyOutFormValues,
    { setSubmitting }: FormikHelpers<MoneyOutFormValues>,
  ) => {
    const form = transformToRequestBody(values);
    setSubmitting(true);
    createCashflowTransactionMutate(form)
      .then(() => {
        if (dialogName) closeDialog(dialogName);

        AppToaster.show({
          message: intl.get('cash_flow_transaction_success_message'),
          intent: Intent.SUCCESS,
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Formik
      validationSchema={CreateMoneyOutSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <MoneyOutFormContent />
    </Formik>
  );
}

export const MoneyOutForm = compose(withDialogActions)(MoneyOutFormInner);
