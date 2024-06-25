// @ts-nocheck
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { Button, Classes, Intent, Radio } from '@blueprintjs/core';
import * as R from 'ramda';
import { CreateRuleFormSchema } from './RuleFormContentForm.schema';
import {
  AccountsSelect,
  AppToaster,
  Box,
  FFormGroup,
  FInputGroup,
  FRadioGroup,
  FSelect,
  Group,
} from '@/components';
import { useCreateBankRule } from '@/hooks/query/bank-rules';
import {
  AssignTransactionTypeOptions,
  FieldCondition,
  Fields,
  RuleFormValues,
  TransactionTypeOptions,
  initialValues,
} from './_utils';
import { useRuleFormDialogBoot } from './RuleFormBoot';
import { transfromToSnakeCase } from '@/utils';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';

function RuleFormContentFormRoot({
  // #withDialogActions
  openDialog,
  closeDialog,
}) {
  const { accounts } = useRuleFormDialogBoot();
  const { mutateAsync: createBankRule } = useCreateBankRule();

  const validationSchema = CreateRuleFormSchema;

  // Handles the form submitting.
  const handleSubmit = (
    values: RuleFormValues,
    { setSubmitting }: FormikHelpers<RuleFormValues>,
  ) => {
    const _value = transfromToSnakeCase(values);

    setSubmitting(true);
    createBankRule(_value)
      .then(() => {
        setSubmitting(false);
        closeDialog(DialogsName.BankRuleForm);

        AppToaster.show({
          intent: Intent.SUCCESS,
          message: 'The bank rule has been created successfully.',
        });
      })
      .catch((error) => {
        setSubmitting(false);

        AppToaster.show({
          intent: Intent.DANGER,
          message: 'Something went wrong!',
        });
      });
  };

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

        <FFormGroup
          name={'applyIfAccountId'}
          label={'Apply the rule to account'}
        >
          <AccountsSelect name={'applyIfAccountId'} items={accounts} />
        </FFormGroup>

        <FFormGroup
          name={'applyIfTransactionType'}
          label={'Apply to transactions are'}
        >
          <FSelect
            name={'applyIfTransactionType'}
            items={TransactionTypeOptions}
          />
        </FFormGroup>

        <FFormGroup
          name={'conditionsType'}
          label={'Categorize the transactions when'}
        >
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
          <FSelect
            name={'assignCategory'}
            items={AssignTransactionTypeOptions}
          />
        </FFormGroup>

        <FFormGroup name={'assignAccountId'} label={'Account category'}>
          <AccountsSelect name={'assignAccountId'} items={accounts} />
        </FFormGroup>

        <FFormGroup name={'assignRef'} label={'Reference'}>
          <FInputGroup name={'assignRef'} />
        </FFormGroup>

        <RuleFormActions />
      </Form>
    </Formik>
  );
}

export const RuleFormContentForm = R.compose(withDialogActions)(
  RuleFormContentFormRoot,
);

function RuleFormConditions() {
  const { values, setFieldValue } = useFormikContext<RuleFormValues>();

  const handleAddConditionBtnClick = () => {
    const _conditions = [
      ...values.conditions,
      { field: '', comparator: '', value: '' },
    ];
    setFieldValue('conditions', _conditions);
  };

  return (
    <Box>
      {values?.conditions?.map((condition, index) => (
        <Group>
          <FFormGroup name={`conditions[${index}].field`} label={'Field'}>
            <FSelect name={`conditions[${index}].field`} items={Fields} />
          </FFormGroup>

          <FFormGroup
            name={`conditions[${index}].comparator`}
            label={'Condition'}
          >
            <FSelect
              name={`conditions[${index}].comparator`}
              items={FieldCondition}
            />
          </FFormGroup>

          <FFormGroup name={`conditions[${index}].value`} label={'Condition'}>
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

function RuleFormActions() {
  const { isSubmitting, submitForm } = useFormikContext<RuleFormValues>();

  const handleSaveBtnClick = () => {
    submitForm();
  };
  const handleCancelBtnClick = () => {};

  return (
    <Box className={Classes.DIALOG_FOOTER}>
      <Button
        intent={Intent.PRIMARY}
        loading={isSubmitting}
        onClick={handleSaveBtnClick}
      >
        Save
      </Button>
      <Button onClick={handleCancelBtnClick}>Cancel</Button>
    </Box>
  );
}
