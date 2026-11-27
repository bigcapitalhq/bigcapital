import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import {
  ErrorMessage,
  Form,
  Formik,
  useFormikContext,
  type FormikHelpers,
} from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import '@/style/pages/Budgets/Form.scss';
import { BudgetEntriesTable } from './BudgetEntriesTable';
import { BudgetFormSchema } from './BudgetForm.schema';
import { BudgetFormFloatingActions } from './BudgetFormFloatingActions';
import { BudgetFormHeaderFields } from './BudgetFormHeaderFields';
import { useBudgetFormContext } from './BudgetFormProvider';
import { BudgetFormSummary } from './BudgetFormSummary';
import {
  getBudgetFormInitialValues,
  getBudgetPeriods,
  getVisibleBudgetAccounts,
  transformBudgetFormToRequest,
} from './utils';
import type { BudgetFormValues } from './types';
import { AppToaster } from '@/components';
import { CLASSES } from '@/constants/classes';

interface ApiFieldError {
  type: string;
}

interface ApiError {
  data?: {
    errors?: ApiFieldError[];
  };
}

/**
 * Budget form body.
 */
function BudgetFormBody() {
  const { values } = useFormikContext<BudgetFormValues>();

  const periods = React.useMemo(
    () => getBudgetPeriods(values.fromDate, values.toDate),
    [values.fromDate, values.toDate],
  );

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        'page-form--budget',
      )}
    >
      <BudgetFormHeaderFields />

      <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
        <ErrorMessage
          name={'entries'}
          render={(message) => (
            <div className={'budget-form__error'}>{message}</div>
          )}
        />
        <BudgetEntriesTable periods={periods} />
        <BudgetFormSummary periods={periods} />
      </div>

      <BudgetFormFloatingActions />
    </div>
  );
}

/**
 * Budget form.
 */
export function BudgetForm() {
  const history = useHistory();
  const {
    budget,
    accountRows,
    fiscalYear,
    isNewMode,
    createBudgetMutate,
    editBudgetMutate,
    getSubmitPayload,
  } = useBudgetFormContext();

  // Form initial values.
  const initialValues = React.useMemo(
    () => getBudgetFormInitialValues(budget, accountRows, fiscalYear),
    [budget, accountRows, fiscalYear],
  );

  // Handles the form submit.
  const handleSubmit = (
    values: BudgetFormValues,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<BudgetFormValues>,
  ) => {
    if (!values.fromDate || !values.toDate) {
      setSubmitting(false);
      return;
    }
    setSubmitting(true);

    const submitPayload = getSubmitPayload();
    const periods = getBudgetPeriods(values.fromDate, values.toDate);
    const visibleAccounts = getVisibleBudgetAccounts(
      accountRows,
      values.includeBalanceSheetAccounts,
    );
    const request = transformBudgetFormToRequest(
      values,
      visibleAccounts,
      periods,
    );

    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('budget.form.saved'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload.redirect) {
        history.push('/budgets');
      } else {
        resetForm();
      }
    };

    const onError = (error: unknown) => {
      const apiErrors = (error as ApiError)?.data?.errors ?? [];
      const formErrors: Record<string, string> = {};

      apiErrors.forEach((apiError) => {
        switch (apiError.type) {
          case 'BUDGET_INVALID_DATE_RANGE':
            formErrors.toDate = intl.get('budget.form.date_range_error');
            break;
          case 'BUDGET_ENTRY_DATE_OUT_OF_RANGE':
          case 'BUDGET_ENTRY_DUPLICATE_DATE':
            formErrors.entries = intl.get('budget.form.entries_invalid');
            break;
          case 'BUDGET_ENTRIES_ACCOUNT_NOT_FOUND':
            formErrors.entries = intl.get('budget.form.accounts_invalid');
            break;
        }
      });
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors as never);
      }
      AppToaster.show({
        message: intl.get('budget.form.save_error'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
    };

    if (isNewMode) {
      createBudgetMutate(request).then(onSuccess).catch(onError);
    } else if (budget) {
      editBudgetMutate([budget.id, request]).then(onSuccess).catch(onError);
    } else {
      setSubmitting(false);
    }
  };

  return (
    <Formik<BudgetFormValues>
      initialValues={initialValues}
      validationSchema={BudgetFormSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <BudgetFormBody />
      </Form>
    </Formik>
  );
}
