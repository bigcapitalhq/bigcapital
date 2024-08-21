// @ts-nocheck
import { useMemo } from 'react';
import * as R from 'ramda';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useAppQueryString } from '@/hooks';
import { FDateInput, FFormGroup, Group, Icon, Stack } from '@/components';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import { TagsControl } from '@/components/TagsControl';
import { Button, FormGroup, Intent, Position } from '@blueprintjs/core';

export function AccountTransactionsUncategorizeFilter() {
  const { bankAccountMetaSummary } = useAccountTransactionsContext();
  const [locationQuery, setLocationQuery] = useAppQueryString();

  const totalUncategorized =
    bankAccountMetaSummary?.totalUncategorizedTransactions;
  const totalRecognized = bankAccountMetaSummary?.totalRecognizedTransactions;

  const totalPending = bankAccountMetaSummary?.totalPendingTransactions;

  const handleTabsChange = (value) => {
    setLocationQuery({ uncategorizedFilter: value });
  };

  const options = useMemo(
    () =>
      R.when(
        () => totalPending > 0,
        R.append({
          value: 'pending',
          label: (
            <>
              Pending <strong>({totalPending})</strong>
            </>
          ),
        }),
      )([
        {
          value: 'all',
          label: (
            <>
              All <strong>({totalUncategorized})</strong>
            </>
          ),
        },
        {
          value: 'recognized',
          label: (
            <>
              Recognized <strong>({totalRecognized})</strong>
            </>
          ),
        },
      ]),
    [totalPending, totalRecognized, totalUncategorized],
  );

  return (
    <Group position={'apart'}>
      <TagsControl
        options={options}
        value={locationQuery?.uncategorizedFilter || 'all'}
        onValueChange={handleTabsChange}
      />
      <TagsControl
        options={[{ value: 'excluded', label: 'Excluded' }]}
        value={locationQuery?.uncategorizedFilter || 'all'}
        onValueChange={handleTabsChange}
      />
    </Group>
  );
}

const initialValues = {
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

function UncategorizedTransactionsDateFilter() {
  const handleSubmit = () => {};

  return (
    <Formik
      initialValues={initialValues}
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
            <Button intent={Intent.PRIMARY}>Filter</Button>
            <Button>Cancel</Button>
          </Group>
        </Stack>
      </Form>
    </Formik>
  );
}
