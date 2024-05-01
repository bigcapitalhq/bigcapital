// @ts-nocheck
import { Formik } from 'formik';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';

import { ExportDialogFormSchema } from './ExportDialogForm.schema';
import { ExportDialogFormContent } from './ExportDialogFormContent';
import { useResourceExport } from '@/hooks/query/FinancialReports/use-export';
import { ExportFormInitialValues } from './type';

// Default initial form values.
const defaultInitialValues = {
  resource: '',
  format: 'csv',
};

interface ExportDialogFormProps {
  initialValues?: ExportFormInitialValues;
}

/**
 * Account form dialog content.
 */
function ExportDialogFormRoot({
  // #ownProps
  initialValues,

  // #withDialogActions
  closeDialog,
}: ExportDialogFormProps) {
  const { mutateAsync: mutateExport } = useResourceExport();

  // Callbacks handles form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    const { resource, format } = values;

    mutateExport({ resource, format })
      .then(() => {
        setSubmitting(false);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  // Form initial values in create and edit mode.
  const initialFormValues = {
    ...defaultInitialValues,
    /**
     * We only care about the fields in the form. Previously unfilled optional
     * values such as `notes` come back from the API as null, so remove those
     * as well.
     */
    ...transformToForm(initialValues, defaultInitialValues),
  };
  return (
    <Formik
      validationSchema={ExportDialogFormSchema}
      initialValues={initialFormValues}
      onSubmit={handleFormSubmit}
    >
      <ExportDialogFormContent />
    </Formik>
  );
}

export const ExportDialogForm =
  compose(withDialogActions)(ExportDialogFormRoot);
