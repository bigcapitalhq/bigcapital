import React, { useMemo } from 'react';
import { Intent } from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { defaultTo, sumBy, isEmpty } from 'lodash';
import { Formik, Form } from 'formik';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { CLASSES } from 'common/classes';

import ExpenseFormHeader from './ExpenseFormHeader';
import ExpenseFormBody from './ExpenseFormBody';
import ExpenseFloatingFooter from './ExpenseFloatingActions';
import ExpenseFormFooter from './ExpenseFormFooter';

import { useExpenseFormContext } from './ExpenseFormPageProvider';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withSettings from 'containers/Settings/withSettings';

import AppToaster from 'components/AppToaster';
import {
  CreateExpenseFormSchema,
  EditExpenseFormSchema,
} from './ExpenseForm.schema';
import { transformErrors, defaultExpense, transformToEditForm } from './utils';
import { compose, orderingLinesIndexes } from 'utils';

/**
 * Expense form.
 */
function ExpenseForm({
  // #withSettings
  baseCurrency,
  preferredPaymentAccount,
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
  const { formatMessage } = useIntl();

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
            currency_code: baseCurrency,
            payment_account_id: defaultTo(preferredPaymentAccount, ''),
            categories: orderingLinesIndexes(defaultExpense.categories),
          }),
    }),
    [expense, baseCurrency, preferredPaymentAccount],
  );

  //  Handle form submit.
  const handleSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);
    const totalAmount = sumBy(values.categories, 'amount');

    if (totalAmount <= 0) {
      AppToaster.show({
        message: formatMessage({
          id: 'amount_cannot_be_zero_or_empty',
        }),
        intent: Intent.DANGER,
      });
      return;
    }
    const categories = values.categories.filter(
      (category) =>
        category.amount && category.index && category.expense_account_id,
    );

    const form = {
      ...values,
      publish: submitPayload.publish,
      categories,
    };
    // Handle request success.
    const handleSuccess = (response) => {
      AppToaster.show({
        message: formatMessage(
          {
            id: isNewMode
              ? 'the_expense_has_been_created_successfully'
              : 'the_expense_has_been_edited_successfully',
          },
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
  withMediaActions,
  withSettings(({ organizationSettings, expenseSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
    preferredPaymentAccount: parseInt(
      expenseSettings?.preferredPaymentAccount,
      10,
    ),
  })),
)(ExpenseForm);
