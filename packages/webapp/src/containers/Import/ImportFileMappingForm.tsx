// @ts-nocheck
import { Intent } from '@blueprintjs/core';
import { useImportFileMapping } from '@/hooks/query/import';
import { Form, Formik, FormikHelpers } from 'formik';
import { useImportFileContext } from './ImportFileProvider';
import { useMemo } from 'react';
import { isEmpty } from 'lodash';
import { AppToaster } from '@/components';

interface ImportFileMappingFormProps {
  children: React.ReactNode;
}

type ImportFileMappingFormValues = Record<string, string | null>;

export function ImportFileMappingForm({
  children,
}: ImportFileMappingFormProps) {
  const { mutateAsync: submitImportFileMapping } = useImportFileMapping();
  const { importId, setStep } = useImportFileContext();

  const initialValues = useImportFileMappingInitialValues();

  const handleSubmit = (
    values: ImportFileMappingFormValues,
    { setSubmitting }: FormikHelpers<ImportFileMappingFormValues>,
  ) => {
    setSubmitting(true);
    const _values = transformValueToReq(values);

    submitImportFileMapping([importId, _values])
      .then(() => {
        setSubmitting(false);
        setStep(2);
      })
      .catch(({ response: { data } }) => {
        if (data.errors.find(e => e.type === "DUPLICATED_FROM_MAP_ATTR")) {
          AppToaster.show({
            message: 'Selected the same sheet columns to multiple fields.',
            intent: Intent.DANGER
          })
        }
        setSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form>{children}</Form>
    </Formik>
  );
}

const transformValueToReq = (value: ImportFileMappingFormValues) => {
  const mapping = Object.keys(value)
    .filter((key) => !isEmpty(value[key]))
    .map((key) => ({ from: value[key], to: key }));
  return { mapping };
};

const useImportFileMappingInitialValues = () => {
  const { entityColumns } = useImportFileContext();

  return useMemo(
    () =>
      entityColumns.reduce((acc, { key, name }) => {
        acc[key] = '';
        return acc;
      }, {}),
    [entityColumns],
  );
};
