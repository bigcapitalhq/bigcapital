import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import { ExportDialogFormSchema } from './ExportDialogForm.schema';
import { ExportDialogFormContent } from './ExportDialogFormContent';
import type { ExportFormInitialValues } from './type';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useResourceExport } from '@/hooks/query/FinancialReports/use-export';
import { compose, transformToForm } from '@/utils';

interface ExportDialogFormValues {
  resource: string;
  format: string;
}

// Default initial form values.
const defaultInitialValues: ExportDialogFormValues = {
  resource: '',
  format: 'csv',
};

interface ExportDialogFormProps extends WithDialogActionsProps {
  initialValues?: ExportFormInitialValues;
}

/**
 * Account form dialog content.
 */
function ExportDialogFormRoot({
  // #ownProps
  initialValues,
  closeDialog,
}: ExportDialogFormProps): React.ReactElement {
  const { mutateAsync: mutateExport } = useResourceExport();

  // Callbacks handles form submit.
  const handleFormSubmit = (
    values: ExportDialogFormValues,
    { setSubmitting }: FormikHelpers<ExportDialogFormValues>,
  ) => {
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
  const initialFormValues: ExportDialogFormValues = {
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
