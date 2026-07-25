import { Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Formik, Form, FormikHelpers } from 'formik';
import { defaultTo, sumBy, isEmpty } from 'lodash';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import type { CreateExpenseBody, EditExpenseBody } from '@bigcapital/sdk-ts';
import { ExpenseFloatingFooter } from './ExpenseFloatingActions';
import {
  CreateExpenseFormSchema,
  EditExpenseFormSchema,
} from './ExpenseForm.schema';
import { ExpenseFormBody } from './ExpenseFormBody';
import { ExpenseFormFooter } from './ExpenseFormFooter';
import { ExpenseFormHeader } from './ExpenseFormHeader';
import { useExpenseFormContext } from './ExpenseFormPageProvider';
import { ExpenseFormTopBar } from './ExpenseFormTopBar';
import type { ExpenseErrorResponse, ExpenseFormValues } from './types';
import {
  transformErrors,
  defaultExpense,
  transformToEditForm,
  transformFormValuesToRequest,
} from './utils';
import { AppToaster, Box } from '@/components';
import { PageForm } from '@/components/PageForm';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { compose } from '@/utils';

/**
 * Expense form.
 */
function ExpenseFormInner() {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const {
    editExpenseMutate,
    createExpenseMutate,
    expense,
    expenseId,
    submitPayloadRef,
    expenseSettings,
  } = useExpenseFormContext();

  const preferredPaymentAccount = parseInt(
    (expenseSettings?.preferredPaymentAccount as string | undefined) ?? '',
    10,
  );

  const isNewMode = !expenseId;

  const history = useHistory();

  const initialValues = useMemo<ExpenseFormValues>(
    () => ({
      ...(!isEmpty(expense)
        ? {
            ...transformToEditForm(expense!, defaultExpense),
          }
        : {
            ...defaultExpense,
            currencyCode: baseCurrency ?? '',
            paymentAccountId: defaultTo(preferredPaymentAccount, ''),
          }),
    }),
    [expense, baseCurrency, preferredPaymentAccount],
  );

  const handleSubmit = (
    values: ExpenseFormValues,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<ExpenseFormValues>,
  ) => {
    setSubmitting(true);
    const totalAmount = sumBy(values.categories, 'amount');

    if (totalAmount <= 0) {
      AppToaster.show({
        message: intl.get('amount_cannot_be_zero_or_empty'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }

    const currentSubmitPayload = submitPayloadRef?.current || {};

    const form = {
      ...transformFormValuesToRequest(values),
      publish: currentSubmitPayload.publish,
    };
    const handleSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_expense_has_been_created_successfully'
            : 'the_expense_has_been_edited_successfully',
          { number: values.paymentAccountId },
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

    const handleError = ({
      data: { errors },
    }: {
      data: { errors: ExpenseErrorResponse[] };
    }) => {
      transformErrors(errors, { setErrors });
      setSubmitting(false);
    };
    if (isNewMode) {
      createExpenseMutate(form as unknown as CreateExpenseBody)
        .then(handleSuccess)
        .catch(handleError);
    } else {
      editExpenseMutate([expense!.id, form as unknown as EditExpenseBody])
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

export const ExpenseForm = compose(withDashboardActions)(ExpenseFormInner);
