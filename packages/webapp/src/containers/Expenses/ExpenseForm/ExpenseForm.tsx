// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';
import { defaultTo, sumBy, isEmpty } from 'lodash';
import { Formik, Form } from 'formik';
import { useHistory } from 'react-router-dom';
import { css } from '@emotion/css';

import ExpenseFormBody from './ExpenseFormBody';
import ExpenseFormHeader from './ExpenseFormHeader';
import ExpenseFloatingFooter from './ExpenseFloatingActions';
import ExpenseFormFooter from './ExpenseFormFooter';
import ExpenseFormTopBar from './ExpenseFormTopBar';

import { useExpenseFormContext } from './ExpenseFormPageProvider';

import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withSettings } from '@/containers/Settings/withSettings';
import { withCurrentOrganization } from '@/containers/Organization/withCurrentOrganization';

import { AppToaster, Box } from '@/components';
import { PageForm } from '@/components/PageForm';
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
    submitPayloadRef,
  } = useExpenseFormContext();

  const isNewMode = !expenseId;

  // History context.
  const history = useHistory();

  // Form initial values.
  const initialValues = useMemo(
    () => {
      if (!isEmpty(expense)) {
        return { ...transformToEditForm(expense, defaultExpense) };
      }
      const preferredId = defaultTo(preferredPaymentAccount, '');
      const payment_splits = [
        { ...defaultExpense.payment_splits[0], payment_account_id: preferredId },
      ];
      return {
        ...defaultExpense,
        currency_code: base_currency,
        payment_splits,
      };
    },
    [expense, base_currency, preferredPaymentAccount],
  );

  //  Handle form submit.
  const handleSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);
    const form = {
      ...transformFormValuesToRequest(values),
    };
    const paymentsTotal = sumBy(form.payment_splits, 'amount');
    const categoriesTotal = sumBy(form.categories, 'amount');
    const percentRows = form.categories.filter(
      (c) => c.amount_type === 'percent',
    ).length;
    // Widen tolerance by 5 mills per percent row to absorb per-row 3dp rounding
    // (e.g. 33/33/33 % splits drift ~0.01 from total).
    const tolerance = 0.005 + 0.005 * percentRows;

    if (paymentsTotal <= 0 || categoriesTotal <= 0) {
      AppToaster.show({
        message: intl.get('amount_cannot_be_zero_or_empty'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    if (Math.abs(paymentsTotal - categoriesTotal) > tolerance) {
      AppToaster.show({
        message:
          intl.get('expense.payment_splits_must_match_categories') ||
          'Payments total must equal categories total.',
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }

    // Get submit payload from ref for synchronous access
    const currentSubmitPayload = submitPayloadRef?.current || {};

    form.publish = currentSubmitPayload.publish;
    // Handle request success.
    const handleSuccess = (response) => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_expense_has_been_created_successfully'
            : 'the_expense_has_been_edited_successfully',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (currentSubmitPayload.redirect) {
        history.push('/expenses');
      }
      if (currentSubmitPayload.resetForm) {
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
    <Formik
      validationSchema={
        isNewMode ? CreateExpenseFormSchema : EditExpenseFormSchema
      }
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form
        className={css({
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        })}
      >
        <PageForm flex={1}>
          <PageForm.Body>
            <ExpenseFormTopBar />
            <ExpenseFormHeader />

            <Box p="18px 32px 0">
              <ExpenseFormBody />
            </Box>
            <ExpenseFormFooter />
          </PageForm.Body>

          <PageForm.Footer>
            <ExpenseFloatingFooter />
          </PageForm.Footer>
        </PageForm>
      </Form>
    </Formik>
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
