import { Form, Formik, useFormikContext } from 'formik';
import { Button, Radio } from '@blueprintjs/core';
import { CreateRuleFormSchema } from './RuleFormContentForm.schema';
import {
  Box,
  FFormGroup,
  FInputGroup,
  FRadioGroup,
  FSelect,
  Group,
} from '@/components';

const initialValues = {
  name: '',
  order: 0,
  applyIfAccountId: '',
  applyIfTransactionType: '',
  conditionsType: '',
  conditions: [
    {
      field: 'description',
      comparator: 'contains',
      value: 'payment',
    },
  ],
  assignCategory: '',
  assignAccountId: '',
};

interface RuleFormValues {
  name: string;
  order: number;
  applyIfAccountId: string;
  applyIfTransactionType: string;
  conditionsType: string;
  conditions: Array<{
    field: string;
    comparator: string;
    value: string;
  }>;
  assignCategory: string;
  assignAccountId: string;
}

export function RuleFormContentForm() {
  const validationSchema = CreateRuleFormSchema;
  const handleSubmit = () => {};

  return (
    <Formik<RuleFormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <FFormGroup name={'name'} label={'Rule Name'}>
          <FInputGroup name={'name'} />
        </FFormGroup>

        <FFormGroup name={'conditionsType'} label={'Apply to transactions are'}>
          <FSelect name={'conditionsType'} items={[]} />
        </FFormGroup>

        <FFormGroup name={''} label={'Categorize the transactions when'}>
          <FRadioGroup name={'conditionsType'}>
            <Radio value={'and'} label={'All the following criteria matches'} />
            <Radio
              value={'or'}
              label={'Any one of the following criteria matches'}
            />
          </FRadioGroup>
        </FFormGroup>

        <RuleFormConditions />

        <h3>Then Assign</h3>

        <FFormGroup name={'assignCategory'} label={'Transaction type'}>
          <FSelect name={'assignCategory'} items={[]} />
        </FFormGroup>

        <FFormGroup name={'assignAccountId'} label={'Account category'}>
          <FSelect name={'assignAccountId'} items={[]} />
        </FFormGroup>

        <FFormGroup name={'assignRef'} label={'Reference'}>
          <FInputGroup name={'assignRef'} />
        </FFormGroup>
      </Form>
    </Formik>
  );
}

function RuleFormConditions() {
  const { values } = useFormikContext<RuleFormValues>();

  const handleAddConditionBtnClick = () => {
    values.conditions.push({
      field: '',
      comparator: '',
      value: '',
    });
  };

  return (
    <Box>
      {values?.conditions?.map((condition, index) => (
        <Group>
          <FFormGroup name={`conditions[${index}].field`} label={'Field'}>
            <FSelect name={`conditions[${index}].field`} items={[]} />
          </FFormGroup>

          <FFormGroup
            name={`conditions[${index}].comparator`}
            label={'Condition'}
          >
            <FSelect name={`conditions[${index}].comparator`} items={[]} />
          </FFormGroup>

          <FFormGroup
            name={`conditions[${index}].condition`}
            label={'Condition'}
          >
            <FInputGroup name={`conditions[${index}].value`} />
          </FFormGroup>
        </Group>
      ))}

      <Button type={'button'} onClick={handleAddConditionBtnClick}>
        Add Condition
      </Button>
    </Box>
  );
}
