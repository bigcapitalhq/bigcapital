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
  Stack,
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
        <FFormGroup name={'name'} label={'Rule Name'} style={{ maxWidth: 300 }}>
          <FInputGroup name={'name'} />
        </FFormGroup>

        <FFormGroup
          name={'applyIfAccountId'}
          label={'Apply the rule to account'}
          style={{ maxWidth: 350 }}
        >
          <AccountsSelect name={'applyIfAccountId'} items={accounts} />
        </FFormGroup>

        <FFormGroup
          name={'applyIfTransactionType'}
          label={'Apply to transactions are'}
          style={{ maxWidth: 350 }}
        >
          <FSelect
            name={'applyIfTransactionType'}
            items={TransactionTypeOptions}
            popoverProps={{ minimal: true, inline: false }}
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
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: '0.8rem' }}>
          Then Assign
        </h3>

        <FFormGroup
          name={'assignCategory'}
          label={'Transaction type'}
          style={{ maxWidth: 300 }}
        >
          <FSelect
            name={'assignCategory'}
            items={AssignTransactionTypeOptions}
            popoverProps={{ minimal: true, inline: false }}
          />
        </FFormGroup>

        <FFormGroup
          name={'assignAccountId'}
          label={'Account category'}
          style={{ maxWidth: 300 }}
        >
          <AccountsSelect name={'assignAccountId'} items={accounts} />
        </FFormGroup>

        <FFormGroup
          name={'assignRef'}
          label={'Reference'}
          style={{ maxWidth: 300 }}
        >
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
    <Box style={{ marginBottom: 15 }}>
      <Stack spacing={15}>
        {values?.conditions?.map((condition, index) => (
          <Group key={index} style={{ width: 500 }}>
            <FFormGroup
              name={`conditions[${index}].field`}
              label={'Field'}
              style={{ marginBottom: 0, flex: '1 0' }}
            >
              <FSelect
                name={`conditions[${index}].field`}
                items={Fields}
                popoverProps={{ minimal: true, inline: false }}
              />
            </FFormGroup>

            <FFormGroup
              name={`conditions[${index}].comparator`}
              label={'Condition'}
              style={{ marginBottom: 0, flex: '1 0' }}
            >
              <FSelect
                name={`conditions[${index}].comparator`}
                items={FieldCondition}
                popoverProps={{ minimal: true, inline: false }}
              />
            </FFormGroup>

            <FFormGroup
              name={`conditions[${index}].value`}
              label={'Value'}
              style={{ marginBottom: 0, flex: '1 0 ', width: '40%' }}
            >
              <FInputGroup name={`conditions[${index}].value`} />
            </FFormGroup>
          </Group>
        ))}
      </Stack>

      <Button
        minimal
        small
        intent={Intent.PRIMARY}
        type={'button'}
        onClick={handleAddConditionBtnClick}
        style={{ marginTop: 8 }}
      >
        Add Condition
      </Button>
    </Box>
  );
}

function RuleFormActionsRoot({
  // #withDialogActions
  closeDialog,
}) {
  const { isSubmitting, submitForm } = useFormikContext<RuleFormValues>();

  const handleSaveBtnClick = () => {
    submitForm();
  };
  const handleCancelBtnClick = () => {
    closeDialog(DialogsName.BankRuleForm);
  };

  return (
    <Box className={Classes.DIALOG_FOOTER}>
      <Box className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button onClick={handleCancelBtnClick}>Cancel</Button>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          onClick={handleSaveBtnClick}
          style={{ minWidth: 100 }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}

const RuleFormActions = R.compose(withDialogActions)(RuleFormActionsRoot);
