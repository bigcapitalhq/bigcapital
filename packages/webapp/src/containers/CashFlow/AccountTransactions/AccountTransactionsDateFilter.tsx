// @ts-nocheck
import { Button, FormGroup, Intent, Position } from '@blueprintjs/core';
import * as Yup from 'yup';
import { Form, Formik, FormikConfig } from 'formik';
import { FDateInput, FFormGroup, Group, Icon, Stack } from '@/components';

const defaultValues = {
  fromDate: '',
  toDate: '',
};

const validationSchema = Yup.object().shape({
  fromDate: Yup.date()
    .nullable()
    .required('From Date is required')
    .max(Yup.ref('toDate'), 'From Date cannot be after To Date'),
  toDate: Yup.date()
    .nullable()
    .required('To Date is required')
    .min(Yup.ref('fromDate'), 'To Date cannot be before From Date'),
});

interface AccountTransactionsDateFilterFormValues {
  fromDate: string;
  toDate: string;
}

interface UncategorizedTransactionsDateFilterProps {
  initialValues?: AccountTransactionsDateFilterFormValues;
  onSubmit?: FormikConfig<AccountTransactionsDateFilterFormValues>['onSubmit'];
}

export function AccountTransactionsDateFilterForm({
  initialValues = {},
  onSubmit,
}: UncategorizedTransactionsDateFilterProps) {
  const handleSubmit = () => {
    return onSubmit && onSubmit(...arguments);
  };

  const formInitialValues = {
    ...defaultValues,
    ...initialValues,
  };

  return (
    <Formik
      initialValues={formInitialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <Stack>
          <Group>
            <FFormGroup name={'fromDate'} label={'From Date'}>
              <FDateInput
                name={'fromDate'}
                popoverProps={{ position: Position.BOTTOM, minimal: true }}
                formatDate={(date) => date.toLocaleDateString()}
                parseDate={(str) => new Date(str)}
                inputProps={{
                  fill: true,
                  leftElement: <Icon icon={'date-range'} />,
                }}
                style={{ marginBottom: 0 }}
              />
            </FFormGroup>

            <FormGroup label={'To Date'} name={'toDate'}>
              <FDateInput
                name={'toDate'}
                popoverProps={{ position: Position.BOTTOM, minimal: true }}
                formatDate={(date) => date.toLocaleDateString()}
                parseDate={(str) => new Date(str)}
                inputProps={{
                  fill: true,
                  leftElement: <Icon icon={'date-range'} />,
                }}
                style={{ marginBottom: 0 }}
              />
            </FormGroup>
          </Group>

          <Group spacing={10}>
            <Button small intent={Intent.PRIMARY}>
              Filter
            </Button>
            <Button small>Cancel</Button>
          </Group>
        </Stack>
      </Form>
    </Formik>
  );
}
