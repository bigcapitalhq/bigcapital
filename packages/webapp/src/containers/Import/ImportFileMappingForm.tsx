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
        if (data.errors.find((e) => e.type === 'DUPLICATED_FROM_MAP_ATTR')) {
          AppToaster.show({
            message: 'Selected the same sheet columns to multiple fields.',
            intent: Intent.DANGER,
          });
        }
        else if (data.errors.find((e) => e.type === 'AMOUNT_ARE_AND_TAX_RATE_ARE_REQUIRED_IF_ANY_ONE_OF_THEM_SELECTED')) {
          AppToaster.show({
            message: 'Amounts Are and Tax Rate are required if any one of them selected',
            intent: Intent.DANGER,
          });
        }
          else if (data.errors.find((e) => e.type === 'AN_INVOICE_CAN_HAVE_ONE_AMOUNT_IN_EITHER_TRUE_OR_FALSE')) {
            AppToaster.show({
              message: 'An Invoice can have same Amounts In either true or false',
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
