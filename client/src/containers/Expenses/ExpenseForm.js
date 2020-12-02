import React, { useMemo, useEffect,useState,useCallback } from 'react';
import { Intent } from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { defaultTo, pick } from 'lodash';
import { Formik, Form } from 'formik';
import moment from 'moment';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { CLASSES } from 'common/classes';

import ExpenseFormHeader from './ExpenseFormHeader';
import ExpenseFormBody from './ExpenseFormBody';
import ExpenseFloatingFooter from './ExpenseFloatingActions';
import ExpenseFormFooter from './ExpenseFormFooter';

import withExpensesActions from 'containers/Expenses/withExpensesActions';
import withExpenseDetail from 'containers/Expenses/withExpenseDetail';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withSettings from 'containers/Settings/withSettings';

import AppToaster from 'components/AppToaster';
import Dragzone from 'components/Dragzone';
import {
  CreateExpenseFormSchema,
  EditExpenseFormSchema,
} from './ExpenseForm.schema';
import { transformErrors } from './utils';
import { compose, repeatValue, orderingLinesIndexes } from 'utils';

const MIN_LINES_NUMBER = 4;

const defaultCategory = {
  index: 0,
  amount: '',
  expense_account_id: '',
  description: '',
};

const defaultInitialValues = {
  payment_account_id: '',
  beneficiary: '',
  payment_date: moment(new Date()).format('YYYY-MM-DD'),
  description: '',
  reference_no: '',
  currency_code: '',
  is_published:'',
  categories: [...repeatValue(defaultCategory, MIN_LINES_NUMBER)],
};

/**
 * Expense form.
 */
function ExpenseForm({
  // #withMedia
  requestSubmitMedia,
  requestDeleteMedia,

  // #withExpensesActions
  requestSubmitExpense,
  requestEditExpense,
  requestFetchExpensesTable,

  // #withDashboard
  changePageTitle,
  changePageSubtitle,

  // #withExpenseDetail
  expense,

  // #withSettings
  baseCurrency,
  preferredPaymentAccount,

  // #ownProps
  expenseId,
  onFormSubmit,
  onCancelForm,
}) {
  const isNewMode = !expenseId;
  const [submitPayload, setSubmitPayload] = useState({});
  const { formatMessage } = useIntl();
  const history = useHistory();

  const validationSchema = isNewMode
    ? CreateExpenseFormSchema
    : EditExpenseFormSchema;

  useEffect(() => {
    if (isNewMode) {
      changePageTitle(formatMessage({ id: 'new_expense' }));
    } else {
      changePageTitle(formatMessage({ id: 'edit_expense' }));
    }
  }, [changePageTitle, isNewMode, formatMessage]);

  const initialValues = useMemo(
    () => ({
      ...(expense
        ? {
            ...pick(expense, Object.keys(defaultInitialValues)),
            categories: [
              ...expense.categories.map((category) => ({
                ...pick(category, Object.keys(defaultCategory)),
              })),
              // ...repeatValue(
              //   defaultCategory,
              //   Math.max(MIN_LINES_NUMBER - expense.categories.length, 0),
              // ),
            ],
          }
        : {
            ...defaultInitialValues,
            currency_code: baseCurrency,
            payment_account_id: defaultTo(preferredPaymentAccount, ''),
            categories: orderingLinesIndexes(defaultInitialValues.categories),
          }),
    }),
    [expense, baseCurrency, preferredPaymentAccount],
  );

  const handleSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);
    const totalAmount = values.categories.reduce((total, item) => {
      return total + item.amount;
    }, 0);

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
              ? 'the_expense_has_been_successfully_created'
              : 'the_expense_has_been_successfully_edited',
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

    // Handle request error
    const handleError = (error) => {
      transformErrors(error, { setErrors });
      setSubmitting(false);
    };
    if (isNewMode) {
      requestSubmitExpense(form).then(handleSuccess).catch(handleError);
    } else {
      requestEditExpense(expense.id, form)
        .then(handleSuccess)
        .catch(handleError);
    }
  };
  const handleCancelClick = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleSubmitClick = useCallback(
    (event, payload) => {
      setSubmitPayload({ ...payload });
    },
    [setSubmitPayload],
  );

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        CLASSES.PAGE_FORM_EXPENSE,
      )}
    >
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <ExpenseFormHeader />
            <ExpenseFormBody />
            <ExpenseFormFooter />
            <ExpenseFloatingFooter
              isSubmitting={isSubmitting}
              expense={expenseId}
              expensePublished={values.is_published}
              onCancelClick={handleCancelClick}
              onSubmitClick={handleSubmitClick}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default compose(
  withExpensesActions,
  withAccountsActions,
  withDashboardActions,
  withMediaActions,
  withExpenseDetail(),
  withSettings(({ organizationSettings, expenseSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
    preferredPaymentAccount: parseInt(
      expenseSettings?.preferredPaymentAccount,
      10,
    ),
  })),
)(ExpenseForm);
