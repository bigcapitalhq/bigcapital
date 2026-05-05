// @ts-nocheck
import { Intent } from '@blueprintjs/core';
import { useImportFileMapping } from '@/hooks/query/import';
import { Form, Formik, FormikHelpers } from 'formik';
import { useImportFileContext } from './ImportFileProvider';
import { AppToaster } from '@/components';
import { ImportFileMappingFormProps } from './_types';
import {
  transformValueToReq,
  useImportFileMappingInitialValues,
} from './_utils';

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
        const dupFrom = data.errors.find(
          (e) => e.type === 'DUPLICATED_FROM_MAP_ATTR',
        );
        const dupTo = data.errors.find(
          (e) => e.type === 'DUPLICATED_TO_MAP_ATTR',
        );
        const invalid = data.errors.find(
          (e) => e.type === 'INVALID_MAP_ATTRS',
        );
        if (dupFrom) {
          const col = dupFrom.payload?.from;
          const tos = dupFrom.payload?.tos || [];
          AppToaster.show({
            message: col
              ? `Sheet column "${col}" is mapped to more than one field${
                  tos.length ? ` (${tos.join(', ')})` : ''
                }. Each sheet column may map to only one field.`
              : 'Selected the same sheet column to multiple fields.',
            intent: Intent.DANGER,
          });
        } else if (dupTo) {
          const field = dupTo.payload?.to;
          const froms = dupTo.payload?.froms || [];
          AppToaster.show({
            message: field
              ? `Field "${field}" has more than one sheet column assigned${
                  froms.length ? ` (${froms.join(', ')})` : ''
                }. Each field may receive only one sheet column.`
              : 'Multiple sheet columns mapped to the same field.',
            intent: Intent.DANGER,
          });
        } else if (invalid) {
          const items = invalid.payload?.invalid || [];
          const detail = items
            .slice(0, 3)
            .map((m) => `${m.from || '(empty)'} → ${m.to || '(empty)'}`)
            .join('; ');
          AppToaster.show({
            message: `Invalid mapping${detail ? `: ${detail}` : ''}${
              items.length > 3 ? ` … and ${items.length - 3} more` : ''
            }.`,
            intent: Intent.DANGER,
          });
        } else {
          AppToaster.show({
            message: 'Could not save the mapping.',
            intent: Intent.DANGER,
          });
        }
        setSubmitting(false);
      });
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>{children}</Form>
    </Formik>
  );
}
