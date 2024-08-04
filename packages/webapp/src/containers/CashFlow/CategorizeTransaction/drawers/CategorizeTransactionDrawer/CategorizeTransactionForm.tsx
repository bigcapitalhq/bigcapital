// @ts-nocheck
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import styled from 'styled-components';
import { CreateCategorizeTransactionSchema } from './CategorizeTransactionForm.schema';
import { CategorizeTransactionFormContent } from './CategorizeTransactionFormContent';
import { CategorizeTransactionFormFooter } from './CategorizeTransactionFormFooter';
import { useCategorizeTransaction } from '@/hooks/query';
import {
  tranformToRequest,
  useCategorizeTransactionFormInitialValues,
} from './_utils';
import { withBankingActions } from '@/containers/CashFlow/withBankingActions';
import { AppToaster } from '@/components';
import { useCategorizeTransactionTabsBoot } from '@/containers/CashFlow/CategorizeTransactionAside/CategorizeTransactionTabsBoot';
import { compose } from '@/utils';

/**
 * Categorize cashflow transaction form dialog content.
 */
function CategorizeTransactionFormRoot({
  // #withBankingActions
  closeMatchingTransactionAside,
}) {
  const { uncategorizedTransactionIds } = useCategorizeTransactionTabsBoot();
  const { mutateAsync: categorizeTransaction } = useCategorizeTransaction();

  // Form initial values in create and edit mode.
  const initialValues = useCategorizeTransactionFormInitialValues();

  // Callbacks handles form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const _values = tranformToRequest(values, uncategorizedTransactionIds);

    setSubmitting(true);
    categorizeTransaction(_values)
      .then(() => {
        setSubmitting(false);

        AppToaster.show({
          message: 'The uncategorized transaction has been categorized.',
          intent: Intent.SUCCESS,
        });
        closeMatchingTransactionAside();
      })
      .catch((err) => {
        setSubmitting(false);
        if (
          err.response.data?.errors?.some(
            (e) => e.type === 'BRANCH_ID_REQUIRED',
          )
        ) {
          setErrors({
            branchId: 'The branch is required.',
          });
        } else {
          AppToaster.show({
            message: 'Something went wrong!',
            intent: Intent.DANGER,
          });
        }
      });
  };

  return (
    <Formik
      validationSchema={CreateCategorizeTransactionSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <FormRoot>
        <CategorizeTransactionFormContent />
        <CategorizeTransactionFormFooter />
      </FormRoot>
    </Formik>
  );
}

export const CategorizeTransactionForm = compose(withBankingActions)(
  CategorizeTransactionFormRoot,
);

const FormRoot = styled(Form)`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;

  .bp4-form-group .bp4-form-content {
    flex: 1 0;
  }
  .bp4-form-group .bp4-label {
    width: 140px;
  }
  .bp4-form-group {
    margin-bottom: 18px;
  }
`;
