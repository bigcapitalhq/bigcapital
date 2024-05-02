// @ts-nocheck
import { Formik } from 'formik';

import { compose, transformToForm } from '@/utils';

import { ExportDialogFormSchema } from './ExportDialogForm.schema';
import { ExportDialogFormContent } from './ExportDialogFormContent';
import { useResourceExport } from '@/hooks/query/FinancialReports/use-export';
import { ExportFormInitialValues } from './type';
import { AppToaster } from '@/components';
import { Intent } from '@blueprintjs/core';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';

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
        closeDialog(DialogsName.Export);
      })
      .catch(() => {
        setSubmitting(false);
        AppToaster.show({
          intent: Intent.DANGER,
          message: 'Something went wrong!',
        });
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
