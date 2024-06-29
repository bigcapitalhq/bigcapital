// @ts-nocheck
import { Formik, Form } from 'formik';
import styled from 'styled-components';
import { CreateCategorizeTransactionSchema } from './CategorizeTransactionForm.schema';
import { CategorizeTransactionFormContent } from './CategorizeTransactionFormContent';
import { CategorizeTransactionFormFooter } from './CategorizeTransactionFormFooter';
import { useCategorizeTransaction } from '@/hooks/query';
import { useCategorizeTransactionBoot } from './CategorizeTransactionBoot';
import { DRAWERS } from '@/constants/drawers';
import {
  transformToCategorizeForm,
  defaultInitialValues,
  tranformToRequest,
} from './_utils';
import { compose } from '@/utils';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import { AppToaster } from '@/components';
import { Intent } from '@blueprintjs/core';
import { useCategorizeTransactionTabsBoot } from '@/containers/CashFlow/CategorizeTransactionAside/CategorizeTransactionTabsBoot';

/**
 * Categorize cashflow transaction form dialog content.
 */
function CategorizeTransactionFormRoot({
  // #withDrawerActions
  closeDrawer,
}) {
  const { uncategorizedTransactionId, uncategorizedTransaction } =
    useCategorizeTransactionTabsBoot();
  const { primaryBranch } = useCategorizeTransactionBoot();
  const { mutateAsync: categorizeTransaction } = useCategorizeTransaction();

  // Callbacks handles form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const transformedValues = tranformToRequest(values);

    setSubmitting(true);
    categorizeTransaction([uncategorizedTransactionId, transformedValues])
      .then(() => {
        setSubmitting(false);
        closeDrawer(DRAWERS.CATEGORIZE_TRANSACTION);

        AppToaster.show({
          message: 'The uncategorized transaction has been categorized.',
          intent: Intent.SUCCESS,
        });
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
  // Form initial values in create and edit mode.
  const initialValues = {
    ...defaultInitialValues,
    /**
     * We only care about the fields in the form. Previously unfilled optional
     * values such as `notes` come back from the API as null, so remove those
     * as well.
     */
    ...transformToCategorizeForm(uncategorizedTransaction),

    /** Assign the primary branch id as default value. */
    branchId: primaryBranch?.id || null,
  };

  return (
    <DivRoot>
      <Formik
        validationSchema={CreateCategorizeTransactionSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <CategorizeTransactionFormContent />
          <CategorizeTransactionFormFooter />
        </Form>
      </Formik>
    </DivRoot>
  );
}

export const CategorizeTransactionForm = compose(withDrawerActions)(
  CategorizeTransactionFormRoot,
);

const DivRoot = styled.div`
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
