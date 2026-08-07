import { Button, FormGroup, Intent, Position } from '@blueprintjs/core';
import {
  Form,
  Formik,
  FormikConfig,
  FormikHelpers,
  useFormikContext,
} from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import {
  FDateInput,
  FFormGroup,
  FSelect,
  Group,
  Icon,
  Stack,
} from '@/components';

export interface AccountTransactionsDateFilterFormValues {
  period: string;
  fromDate: string | Date | null;
  toDate: string | Date | null;
}

const defaultValues: AccountTransactionsDateFilterFormValues = {
  period: 'all_dates',
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

interface UncategorizedTransactionsDateFilterProps {
  initialValues?: Partial<AccountTransactionsDateFilterFormValues>;
  onSubmit?: FormikConfig<AccountTransactionsDateFilterFormValues>['onSubmit'];
}

interface DatePeriodOption {
  text: string;
  value: string;
}

export function AccountTransactionsDateFilterForm({
  initialValues = {},
  onSubmit,
}: UncategorizedTransactionsDateFilterProps) {
  const handleSubmit = (
    values: AccountTransactionsDateFilterFormValues,
    bag: FormikHelpers<AccountTransactionsDateFilterFormValues>,
  ) => {
    return onSubmit && onSubmit(values, bag);
  };

  const formInitialValues: AccountTransactionsDateFilterFormValues = {
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
        <Stack spacing={15}>
          <Group spacing={10}>
            <AccountTransactionDatePeriodField />

            <FFormGroup
              name={'fromDate'}
              label={'From Date'}
              style={{ marginBottom: 0, flex: '1' }}
            >
              <FDateInput
                name={'fromDate'}
                popoverProps={{ position: Position.BOTTOM, minimal: true }}
                formatDate={(date: Date) => date.toLocaleDateString()}
                parseDate={(str: string) => new Date(str)}
                inputProps={{
                  fill: true,
                  placeholder: 'MM/DD/YYY',
                  leftElement: <Icon icon={'date-range'} />,
                }}
              />
            </FFormGroup>

            <FormGroup label={'To Date'} style={{ marginBottom: 0, flex: '1' }}>
              <FDateInput
                name={'toDate'}
                popoverProps={{ position: Position.BOTTOM, minimal: true }}
                formatDate={(date: Date) => date.toLocaleDateString()}
                parseDate={(str: string) => new Date(str)}
                inputProps={{
                  fill: true,
                  placeholder: 'MM/DD/YYY',
                  leftElement: <Icon icon={'date-range'} />,
                }}
              />
            </FormGroup>
          </Group>

          <AccountTransactionsDateFilterFooter />
        </Stack>
      </Form>
    </Formik>
  );
}

function AccountTransactionsDateFilterFooter() {
  const { submitForm, setValues } =
    useFormikContext<AccountTransactionsDateFilterFormValues>();

  const handleFilterBtnClick = () => {
    submitForm();
  };
  const handleClearBtnClick = () => {
    setValues({
      ...defaultValues,
    });
    submitForm();
  };

  return (
    <Group spacing={10}>
      <Button
        small
        intent={Intent.PRIMARY}
        onClick={handleFilterBtnClick}
        style={{ minWidth: 75 }}
      >
        Filter
      </Button>

      <Button
        intent={Intent.DANGER}
        small
        onClick={handleClearBtnClick}
        minimal
      >
        Clear
      </Button>
    </Group>
  );
}

function AccountTransactionDatePeriodField() {
  const { setFieldValue } =
    useFormikContext<AccountTransactionsDateFilterFormValues>();

  const handleItemChange = (item: DatePeriodOption) => {
    const { fromDate, toDate } = getDateRangePeriod(item.value);

    setFieldValue('fromDate', fromDate);
    setFieldValue('toDate', toDate);
    setFieldValue('period', item.value);
  };

  return (
    <FFormGroup
      name={'period'}
      label={'Date'}
      style={{ marginBottom: 0, flex: '0 28%' }}
    >
      <FSelect
        name={'period'}
        items={periodOptions}
        onItemSelect={handleItemChange}
        popoverProps={{ captureDismiss: true }}
      />
    </FFormGroup>
  );
}

const periodOptions: DatePeriodOption[] = [
  { text: 'All Dates', value: 'all_dates' },
  { text: 'Custom', value: 'custom' },
  { text: 'Today', value: 'today' },
  { text: 'Yesterday', value: 'yesterday' },
  { text: 'This week', value: 'this_week' },
  { text: 'This year', value: 'this_year' },
  { text: 'This month', value: 'this_month' },
  { text: 'last week', value: 'last_week' },
  { text: 'Last year', value: 'last_year' },
  { text: 'Last month', value: 'last_month' },
  { text: 'Last month', value: 'last_month' },
];

const getDateRangePeriod = (
  period: string,
): { fromDate: Date | null; toDate: Date | null } => {
  switch (period) {
    case 'today':
      return {
        fromDate: moment().startOf('day').toDate(),
        toDate: moment().endOf('day').toDate(),
      };
    case 'yesterday':
      return {
        fromDate: moment().subtract(1, 'days').startOf('day').toDate(),
        toDate: moment().subtract(1, 'days').endOf('day').toDate(),
      };
    case 'this_week':
      return {
        fromDate: moment().startOf('week').toDate(),
        toDate: moment().endOf('week').toDate(),
      };
    case 'this_month':
      return {
        fromDate: moment().startOf('month').toDate(),
        toDate: moment().endOf('month').toDate(),
      };
    case 'this_year':
      return {
        fromDate: moment().startOf('year').toDate(),
        toDate: moment().endOf('year').toDate(),
      };
    case 'last_week':
      return {
        fromDate: moment().subtract(1, 'weeks').startOf('week').toDate(),
        toDate: moment().subtract(1, 'weeks').endOf('week').toDate(),
      };
    case 'last_month':
      return {
        fromDate: moment().subtract(1, 'months').startOf('month').toDate(),
        toDate: moment().subtract(1, 'months').endOf('month').toDate(),
      };
    case 'last_year':
      return {
        fromDate: moment().subtract(1, 'years').startOf('year').toDate(),
        toDate: moment().subtract(1, 'years').endOf('year').toDate(),
      };
    case 'all_dates':
    case 'custom':
    default:
      return { fromDate: null, toDate: null };
  }
};
