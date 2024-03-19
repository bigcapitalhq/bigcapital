// @ts-nocheck
import { AppToaster } from '@/components';
import { useImportFileUpload } from '@/hooks/query/import';
import { Intent } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useImportFileContext } from './ImportFileProvider';

const initialValues = {
  file: null,
} as ImportFileUploadValues;

interface ImportFileUploadFormProps {
  children: React.ReactNode;
}

const validationSchema = Yup.object().shape({
  file: Yup.mixed().required('File is required'),
});

interface ImportFileUploadValues {
  file: File | null;
}

export function ImportFileUploadForm({ children }: ImportFileUploadFormProps) {
  const { mutateAsync: uploadImportFile } = useImportFileUpload();
  const { setStep, setSheetColumns, setEntityColumns, setImportId } = useImportFileContext();

  const handleSubmit = (
    values: ImportFileUploadValues,
    { setSubmitting }: FormikHelpers<ImportFileUploadValues>,
  ) => {
    if (!values.file) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append('file', values.file);
    formData.append('resource', 'Account');

    uploadImportFile(formData)
      .then(({ data }) => {
        setImportId(data.import.import_id);
        setSheetColumns(data.sheet_columns);
        setEntityColumns(data.resource_columns);
        setStep(1);
        setSubmitting(false);
      })
      .catch((error) => {
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
