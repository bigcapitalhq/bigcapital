// @ts-nocheck
import { AppToaster } from '@/components';
import { useImportFileUpload } from '@/hooks/query/import';
import { Intent } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useImportFileContext } from './ImportFileProvider';
import { ImportStepperStep } from './_types';

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

export function ImportFileUploadForm({
  children,
  formikProps,
  formProps,
}: ImportFileUploadFormProps) {
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
    if (!values.file) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append('file', values.file);
    formData.append('resource', resource);
    formData.append('params', JSON.stringify(params));

    uploadImportFile(formData)
      .then(({ data }) => {
        setImportId(data.import.import_id);
        setSheetColumns(data.sheet_columns);
        setEntityColumns(data.resource_columns);
        setStep(ImportStepperStep.Mapping);
        setSubmitting(false);
      })
      .catch(({ response: { data } }) => {
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
        setSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      {...formikProps}
    >
      <Form {...formProps}>{children}</Form>
    </Formik>
  );
}
