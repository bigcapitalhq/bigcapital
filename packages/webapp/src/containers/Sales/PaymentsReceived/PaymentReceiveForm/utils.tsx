import { Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { omit, pick, first, sumBy } from 'lodash';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import { AppToaster } from '@/components';
import {
  transformAttachmentsToForm,
  transformAttachmentsToRequest,
} from '@/containers/Attachments/utils';
import { convertBrandingTemplatesToOptions } from '@/containers/BrandingTemplates/BrandingTemplatesSelectFields';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import {
  defaultFastFieldShouldUpdate,
  transformToForm,
  safeSumBy,
  orderingLinesIndexes,
  formattedAmount,
} from '@/utils';

export type PaymentReceiveEntry = {
  index: string | number;
  paymentAmount: string | number;
  invoiceId: string | number;
  invoiceNo: string;
  dueAmount: string | number;
  date: string;
  amount: string | number;
  currencyCode: string;
  entryType?: string;
  branchId?: string | number;
  totalPaymentAmount?: string | number;
};

export type PaymentReceiveFormValues = {
  customerId: string | number;
  depositAccountId: string | number;
  paymentDate: string;
  referenceNo: string;
  paymentReceiveNo: string;
  paymentReceiveNoManually: string;
  statement: string;
  amount: string | number;
  currencyCode: string;
  exchangeRate: number;
  entries: PaymentReceiveEntry[];
  attachments: unknown[];
  branchId: string | number;
  pdfTemplateId: string | number;
};

export type PaymentReceiveRequestEntry = {
  index: string | number;
  paymentAmount: string | number;
  invoiceId: string | number;
};

export type PaymentReceiveRequestBody = {
  customerId: string | number;
  depositAccountId: string | number;
  paymentDate: string;
  paymentReceiveNo?: string;
  branchId: string | number;
  statement: string;
  entries: PaymentReceiveRequestEntry[];
  attachments: unknown[];
};

export type PaymentReceiveErrorResponse = {
  type: string;
  indexes?: number[];
  meta?: unknown[];
};

type PaymentReceiveEditPage = NonNullable<
  ReturnType<typeof usePaymentReceiveFormContext>['paymentReceiveEditPage']
>;

// Default payment receive entry.
export const defaultPaymentReceiveEntry: PaymentReceiveEntry = {
  index: '',
  paymentAmount: '',
  invoiceId: '',
  invoiceNo: '',
  dueAmount: '',
  date: '',
  amount: '',
  currencyCode: '',
};

// Form initial values.
export const defaultPaymentReceive: PaymentReceiveFormValues = {
  customerId: '',
  depositAccountId: '',
  paymentDate: moment(new Date()).format('YYYY-MM-DD'),
  referenceNo: '',
  paymentReceiveNo: '',
  paymentReceiveNoManually: '',
  statement: '',
  amount: '',
  currencyCode: '',
  exchangeRate: 1,
  entries: [],
  attachments: [],
  branchId: '',
  pdfTemplateId: '',
};

export const defaultRequestPaymentEntry: PaymentReceiveRequestEntry = {
  index: '',
  paymentAmount: '',
  invoiceId: '',
};

export const defaultRequestPayment: PaymentReceiveRequestBody = {
  customerId: '',
  depositAccountId: '',
  paymentDate: '',
  paymentReceiveNo: '',
  branchId: '',
  statement: '',
  entries: [],
  attachments: [],
};

type InvoiceRow = {
  id: string | number;
  due_amount: string | number;
  invoice_date: string;
  balance: string | number;
  currency_code: string;
  invoice_no: string;
  branch_id: string | number;
  payment_amount?: string | number;
};

export type PaymentReceiveEditEntry = {
  paymentAmount?: string | number;
} & Partial<PaymentReceiveEntry>;

/**
 * Transformes the edit payment receive to initial values of the form.
 */
export const transformToEditForm = (
  paymentReceive: PaymentReceiveEditPage | Record<string, unknown>,
  paymentReceiveEntries: PaymentReceiveEditEntry[],
): PaymentReceiveFormValues =>
  ({
    ...transformToForm(paymentReceive, defaultPaymentReceive),
    entries: [
      ...paymentReceiveEntries.map((paymentReceiveEntry) => ({
        ...transformToForm(paymentReceiveEntry, defaultPaymentReceiveEntry),
        paymentAmount: paymentReceiveEntry.paymentAmount || '',
      })),
    ],
    attachments: transformAttachmentsToForm(paymentReceive),
  }) as PaymentReceiveFormValues;

/**
 * Transformes the given invoices to the new page receivable entries.
 */
export const transformInvoicesNewPageEntries = (
  invoices: InvoiceRow[],
): PaymentReceiveEntry[] =>
  [
    ...invoices.map((invoice, index) => ({
      index: index + 1,
      invoiceId: invoice.id,
      entryType: 'invoice',
      dueAmount: invoice.due_amount,
      date: invoice.invoice_date,
      amount: invoice.balance,
      currencyCode: invoice.currency_code,
      paymentAmount: '',
      invoiceNo: invoice.invoice_no,
      branchId: invoice.branch_id,
      totalPaymentAmount: invoice.payment_amount,
    })),
  ] as PaymentReceiveEntry[];

export const transformEntriesToEditForm = (
  receivableEntries: InvoiceRow[],
): PaymentReceiveEntry[] => [
  ...transformInvoicesNewPageEntries([...(receivableEntries || [])]),
];

export const clearAllPaymentEntries = (
  entries: PaymentReceiveEntry[],
): PaymentReceiveEntry[] => [
  ...entries.map((entry) => ({ ...entry, paymentAmount: 0 })),
];

export const amountPaymentEntries = (
  amount: number,
  entries: PaymentReceiveEntry[],
): PaymentReceiveEntry[] => {
  let total = amount;

  return entries.map((item) => {
    const diff = Math.min(Number(item.dueAmount), total);
    total -= Math.max(diff, 0);

    return {
      ...item,
      paymentAmount: diff,
    };
  });
};

export const fullAmountPaymentEntries = (
  entries: PaymentReceiveEntry[],
): PaymentReceiveEntry[] => {
  return entries.map((item) => ({
    ...item,
    paymentAmount: item.dueAmount,
  }));
};

type FieldShouldUpdateDeps = {
  items?: unknown[];
  accounts?: unknown[];
  shouldUpdateDeps?: {
    items?: unknown[];
    accounts?: unknown[];
  };
};

/**
 * Detarmines the customers fast-field should update.
 */
export const customersFieldShouldUpdate = (
  newProps: FieldShouldUpdateDeps,
  oldProps: FieldShouldUpdateDeps,
): boolean => {
  return (
    newProps.shouldUpdateDeps?.items !== oldProps.shouldUpdateDeps?.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

type AccountsFieldShouldUpdateProps = {
  items?: unknown[];
  shouldUpdateDeps?: { items?: unknown[] };
};

/**
 * Detarmines the accounts fast-field should update.
 */
export const accountsFieldShouldUpdate = (
  newProps: AccountsFieldShouldUpdateProps,
  oldProps: AccountsFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.items !== oldProps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Tranformes form values to request.
 */
export const transformFormToRequest = (
  form: PaymentReceiveFormValues,
): PaymentReceiveRequestBody => {
  const entries = form.entries
    .filter((entry) => entry.invoiceId && entry.paymentAmount)
    .map((entry) => ({
      ...pick(entry, Object.keys(defaultRequestPaymentEntry)),
    })) as PaymentReceiveRequestEntry[];

  const attachments = transformAttachmentsToRequest(form);

  return {
    ...omit(form, ['paymentReceiveNoManually', 'paymentReceiveNo']),
    ...(form.paymentReceiveNoManually && {
      paymentReceiveNo: form.paymentReceiveNo,
    }),
    entries: orderingLinesIndexes(entries),
    attachments,
  } as PaymentReceiveRequestBody;
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext<PaymentReceiveFormValues>();
  const { branches, isBranchesSuccess, isNewMode } =
    usePaymentReceiveFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess && isNewMode && branches) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branchId', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches, isNewMode]);
};

/**
 * Transformes the response errors types.
 */
export const transformErrors = (
  errors: PaymentReceiveErrorResponse[],
  {
    setFieldError,
  }: { setFieldError: (field: string, message: string) => void },
): void => {
  const getError = (errorType: string) =>
    errors.find((e) => e.type === errorType);

  if (getError('PAYMENT_RECEIVE_NO_EXISTS')) {
    setFieldError('paymentReceiveNo', intl.get('payment_number_is_not_unique'));
  }
  if (getError('PAYMENT_RECEIVE_NO_REQUIRED')) {
    setFieldError(
      'paymentReceiveNo',
      intl.get('payment_received.field.error.payment_receive_no_required'),
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

/**
 * Retreives the payment receive totals.
 */
export const usePaymentReceiveTotals = () => {
  const {
    values: { entries, currencyCode },
  } = useFormikContext<PaymentReceiveFormValues>();

  const total = React.useMemo(
    () => safeSumBy(entries, 'paymentAmount'),
    [entries],
  );

  const formattedTotal = React.useMemo(
    () => formattedAmount(total, currencyCode),
    [total, currencyCode],
  );
  const formattedSubtotal = React.useMemo(
    () => formattedAmount(total, currencyCode, { money: false }),
    [total, currencyCode],
  );

  return {
    total,
    formattedTotal,
    formattedSubtotal,
  };
};

export const usePaymentReceivedTotalAppliedAmount = (): number => {
  const {
    values: { entries },
  } = useFormikContext<PaymentReceiveFormValues>();

  return React.useMemo(() => sumBy(entries, 'paymentAmount'), [entries]);
};

export const usePaymentReceivedTotalAmount = () => {
  const {
    values: { amount },
  } = useFormikContext<PaymentReceiveFormValues>();

  return amount;
};

export const usePaymentReceivedTotalExceededAmount = (): number => {
  const totalAmount = usePaymentReceivedTotalAmount();
  const totalApplied = usePaymentReceivedTotalAppliedAmount();

  return Math.abs(Number(totalAmount) - totalApplied);
};

/**
 * Detarmines whether the payment has foreign customer.
 */
export const useEstimateIsForeignCustomer = (): boolean => {
  const { values } = useFormikContext<PaymentReceiveFormValues>();
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const isForeignCustomer = React.useMemo(
    () => values.currencyCode !== baseCurrency,
    [values.currencyCode, baseCurrency],
  );
  return isForeignCustomer;
};

type ResetFormStateArgs = {
  initialValues: PaymentReceiveFormValues;
  values: PaymentReceiveFormValues;
  resetForm: (nextState?: { values: PaymentReceiveFormValues }) => void;
};

export const resetFormState = ({
  initialValues,
  values,
  resetForm,
}: ResetFormStateArgs) => {
  resetForm({
    values: {
      ...initialValues,
      branchId: values.branchId,
    },
  });
};

export const getExceededAmountFromValues = (
  values: PaymentReceiveFormValues,
): number => {
  const totalApplied = sumBy(values.entries, 'paymentAmount');
  const totalAmount = Number(values.amount);

  return totalAmount - totalApplied;
};

export const usePaymentReceivedFormBrandingTemplatesOptions = () => {
  const { brandingTemplates } = usePaymentReceiveFormContext();

  return React.useMemo(
    () =>
      convertBrandingTemplatesToOptions(
        (brandingTemplates ?? []) as Parameters<
          typeof convertBrandingTemplatesToOptions
        >[0],
      ),
    [brandingTemplates],
  );
};
