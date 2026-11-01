import { Intent } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { ImportAlert, ImportStepperStep } from './_types';
import { useAlertsManager } from './AlertsManager';
import { EntityColumn, useImportFileContext } from './ImportFileProvider';
import type { ImportFileUploadValues } from './_types';
import type { ReactNode } from 'react';
import { AppToaster } from '@/components';
import { useImportFileUpload } from '@/hooks/query/import';

const initialValues: ImportFileUploadValues = {
  file: null,
};

const validationSchema = Yup.object().shape({
  file: Yup.mixed().required('File is required'),
});

interface ImportErrorResponse {
  errors: Array<{ type: string }>;
}

interface ImportFileUploadFormProps {
  children: ReactNode;
}

export function ImportFileUploadForm({ children }: ImportFileUploadFormProps) {
  const { showAlert, hideAlerts } = useAlertsManager();
  const { mutateAsync: uploadImportFile } = useImportFileUpload();
  const {
    resource,
    params,
    setStep,
    setSheetColumns,
    setEntityColumns,
    setImportId,
  } = useImportFileContext();

  const handleSubmit = (
    values: ImportFileUploadValues,
    { setSubmitting }: FormikHelpers<ImportFileUploadValues>,
  ) => {
    hideAlerts();
    if (!values.file) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append('file', values.file);
    formData.append('resource', resource);
    formData.append('params', JSON.stringify(params));

    uploadImportFile(formData)
      .then((response) => {
        setImportId(response.import.importId);
        setSheetColumns(response.sheetColumns);
        // SDK ships a flat `resourceColumns` shape; the runtime response is
        // already grouped (groupKey/groupLabel/fields). Cast at the boundary.
        setEntityColumns(response.resourceColumns as unknown as EntityColumn[]);
        setStep(ImportStepperStep.Mapping);
        setSubmitting(false);
      })
      .catch(({ data }: { data: ImportErrorResponse }) => {
        if (
          data.errors.find(
            (er) => er.type === 'IMPORTED_FILE_EXTENSION_INVALID',
          )
        ) {
          AppToaster.show({
            intent: Intent.DANGER,
            message: 'The extenstion of uploaded file is not supported.',
          });
        }
        if (data.errors.find((er) => er.type === 'IMPORTED_SHEET_EMPTY')) {
          showAlert(ImportAlert.IMPORTED_SHEET_EMPTY);
        }
        setSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form>{children}</Form>
    </Formik>
  );
}
