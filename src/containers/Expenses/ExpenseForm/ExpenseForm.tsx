// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { Intent } from '@blueprintjs/core';
import { defaultTo, sumBy, isEmpty } from 'lodash';
import { Formik, Form } from 'formik';
import { useHistory } from 'react-router-dom';
import { CLASSES } from '@/constants/classes';

import ExpenseFormBody from './ExpenseFormBody';
import ExpenseFormHeader from './ExpenseFormHeader';
import ExpenseFloatingFooter from './ExpenseFloatingActions';
import ExpenseFormFooter from './ExpenseFormFooter';
import ExpenseFormTopBar from './ExpenseFormTopBar';

import { useExpenseFormContext } from './ExpenseFormPageProvider';

import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withSettings from '@/containers/Settings/withSettings';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

import { AppToaster } from '@/components';
import {
  CreateExpenseFormSchema,
  EditExpenseFormSchema,
} from './ExpenseForm.schema';
import {
  transformErrors,
  defaultExpense,
  transformToEditForm,
  transformFormValuesToRequest,
} from './utils';
import { compose } from '@/utils';

/**
 * Expense form.
 */
function ExpenseForm({
  // #withSettings
  preferredPaymentAccount,
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  // Expense form context.
  const {
    editExpenseMutate,
    createExpenseMutate,
    expense,
    expenseId,
    submitPayload,
  } = useExpenseFormContext();

  const isNewMode = !expenseId;

  // History context.
  const history = useHistory();

  // Form initial values.
  const initialValues = useMemo(
    () => ({
      ...(!isEmpty(expense)
        ? {
            ...transformToEditForm(expense, defaultExpense),
          }
        : {
            ...defaultExpense,
            currency_code: base_currency,
            payment_account_id: defaultTo(preferredPaymentAccount, ''),
          }),
    }),
    [expense, base_currency, preferredPaymentAccount],
  );

  //  Handle form submit.
  const handleSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);
    const totalAmount = sumBy(values.categories, 'amount');

    if (totalAmount <= 0) {
      AppToaster.show({
        message: intl.get('amount_cannot_be_zero_or_empty'),
        intent: Intent.DANGER,
      });
      return;
    }

    const form = {
      ...transformFormValuesToRequest(values),
      publish: submitPayload.publish,
    };
    // Handle request success.
    const handleSuccess = (response) => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_expense_has_been_created_successfully'
            : 'the_expense_has_been_edited_successfully',
          { number: values.payment_account_id },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload.redirect) {
        history.push('/expenses');
      }
      if (submitPayload.resetForm) {
        resetForm();
      }
    };

    // Handle the request error.
    const handleError = ({
      response: {
        data: { errors },
      },
    }) => {
      transformErrors(errors, { setErrors });
      setSubmitting(false);
    };
    if (isNewMode) {
      createExpenseMutate(form).then(handleSuccess).catch(handleError);
    } else {
      editExpenseMutate([expense.id, form])
        .then(handleSuccess)
        .catch(handleError);
    }
  };

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        CLASSES.PAGE_FORM_EXPENSE,
      )}
    >
      <Formik
        validationSchema={
          isNewMode ? CreateExpenseFormSchema : EditExpenseFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        <Form>
          <ExpenseFormTopBar />
          <ExpenseFormHeader />
          <ExpenseFormBody />
          <ExpenseFormFooter />
          <ExpenseFloatingFooter />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withDashboardActions,
  withSettings(({ expenseSettings }) => ({
    preferredPaymentAccount: parseInt(
      expenseSettings?.preferredPaymentAccount,
      10,
    ),
  })),
  withCurrentOrganization(),
)(ExpenseForm);
