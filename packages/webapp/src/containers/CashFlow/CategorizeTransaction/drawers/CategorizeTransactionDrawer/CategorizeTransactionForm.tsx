// @ts-nocheck
import { Formik, Form } from 'formik';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import {
  EditCategorizeTransactionSchema,
  CreateCategorizeTransactionSchema,
} from './CategorizeTransactionForm.schema';
import { compose, transformToForm } from '@/utils';
import { CategorizeTransactionFormContent } from './CategorizeTransactionFormContent';
import { CategorizeTransactionFormFooter } from './CategorizeTransactionFormFooter';

// Default initial form values.
const defaultInitialValues = {};

/**
 * Categorize cashflow transaction form dialog content.
 */
function CategorizeTransactionFormRoot({
  // #withDialogActions
  closeDialog,
}) {
  const isNewMode = true;

  // Form validation schema in create and edit mode.
  const validationSchema = isNewMode
    ? CreateCategorizeTransactionSchema
    : EditCategorizeTransactionSchema;

  // Callbacks handles form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {};

  // Form initial values in create and edit mode.
  const initialValues = {
    ...defaultInitialValues,
    /**
     * We only care about the fields in the form. Previously unfilled optional
     * values such as `notes` come back from the API as null, so remove those
     * as well.
     */
    ...transformToForm({}, defaultInitialValues),
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <Form>
        <CategorizeTransactionFormContent />
        <CategorizeTransactionFormFooter />
      </Form>
    </Formik>
  );
}

export const CategorizeTransactionForm = compose(withDialogActions)(
  CategorizeTransactionFormRoot,
);
