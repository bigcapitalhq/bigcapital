// @ts-nocheck
import { useCallback, useMemo } from 'react';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { get } from 'lodash';
import { Button, Classes, Intent, Radio, Tag } from '@blueprintjs/core';
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
import { useCreateBankRule, useEditBankRule } from '@/hooks/query/bank-rules';
import {
  Fields,
  RuleFormValues,
  TransactionTypeOptions,
  getAccountRootFromMoneyCategory,
  getDefaultFieldConditionByFieldKey,
  getFieldConditionsByFieldKey,
  initialValues,
} from './_utils';
import { useRuleFormDialogBoot } from './RuleFormBoot';
import {
  transformToCamelCase,
  transformToForm,
  transfromToSnakeCase,
} from '@/utils';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';
import { getAddMoneyInOptions, getAddMoneyOutOptions } from '@/constants';

// Retrieves the add money in button options.
const MoneyInOptions = getAddMoneyInOptions();
const MoneyOutOptions = getAddMoneyOutOptions();

function RuleFormContentFormRoot({
  // #withDialogActions
  closeDialog,
}) {
  const { accounts, bankRule, isEditMode, bankRuleId } =
    useRuleFormDialogBoot();
  const { mutateAsync: createBankRule } = useCreateBankRule();
  const { mutateAsync: editBankRule } = useEditBankRule();

  const validationSchema = CreateRuleFormSchema;

  const _initialValues = {
    ...initialValues,
    ...transformToForm(transformToCamelCase(bankRule), initialValues),
  };
  // Handles the form submitting.
  const handleSubmit = (
    values: RuleFormValues,
    { setSubmitting }: FormikHelpers<RuleFormValues>,
  ) => {
    const _values = transfromToSnakeCase(values);
    setSubmitting(true);

    const handleSuccess = () => {
      setSubmitting(false);
      closeDialog(DialogsName.BankRuleForm);
      AppToaster.show({
        intent: Intent.SUCCESS,
        message: 'The bank rule has been created successfully.',
      });
    };
    const handleError = (error) => {
      setSubmitting(false);
      AppToaster.show({
        intent: Intent.DANGER,
        message: 'Something went wrong!',
      });
    };
    if (isEditMode) {
      editBankRule({ id: bankRuleId, value: _values })
        .then(handleSuccess)
        .catch(handleError);
    } else {
      createBankRule(_values).then(handleSuccess).catch(handleError);
    }
  };

  return (
    <Formik<RuleFormValues>
      initialValues={_initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <FFormGroup
          name={'name'}
          label={'Rule Name'}
          labelInfo={<Tag minimal>Required</Tag>}
          style={{ maxWidth: 300 }}
          fastField
        >
          <FInputGroup name={'name'} fastField />
        </FFormGroup>

        <FFormGroup
          name={'applyIfAccountId'}
          label={'Apply the rule to account'}
          labelInfo={<Tag minimal>Required</Tag>}
          style={{ maxWidth: 350 }}
          fastField
        >
          <AccountsSelect
            name={'applyIfAccountId'}
            items={accounts}
            filterByTypes={['cash', 'bank']}
            fastField
          />
        </FFormGroup>

        <RuleApplyIfTransactionTypeField />

        <FFormGroup
          name={'conditionsType'}
          label={'Categorize the transactions when'}
          fastField
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

        <RuleAssignCategoryField />
        <RuleAssignCategoryAccountField />

        <FFormGroup
          name={'assignRef'}
          label={'Reference'}
          style={{ maxWidth: 300 }}
          fastField
        >
          <FInputGroup name={'assignRef'} fastField />
        </FFormGroup>

        <RuleFormActions />
      </Form>
    </Formik>
  );
}

export const RuleFormContentForm = R.compose(withDialogActions)(
  RuleFormContentFormRoot,
);

/**
 * Rule form conditions stack.
 * @returns {React.ReactNode}
 */
function RuleFormConditions() {
  const { values, setFieldValue } = useFormikContext<RuleFormValues>();

  const handleAddConditionBtnClick = () => {
    const _conditions = [
      ...values.conditions,
      { field: '', comparator: '', value: '' },
    ];
    setFieldValue('conditions', _conditions);
  };

  const handleConditionFieldChange = R.curry((index, item) => {
    const defaultComparator = getDefaultFieldConditionByFieldKey(item.value);

    setFieldValue(`conditions[${index}].field`, item.value);
    setFieldValue(`conditions[${index}].comparator`, defaultComparator);
  });

  return (
    <Box style={{ marginBottom: 15 }}>
      <Stack spacing={15}>
        {values?.conditions?.map((condition, index) => (
          <Group key={index} style={{ width: 500 }}>
            <FFormGroup
              name={`conditions[${index}].field`}
              label={'Field'}
              style={{ marginBottom: 0, flex: '1 0' }}
              fastField
            >
              <FSelect
                name={`conditions[${index}].field`}
                items={Fields}
                popoverProps={{ minimal: true, inline: false }}
                onItemChange={handleConditionFieldChange(index)}
                fastField
              />
            </FFormGroup>

            <FFormGroup
              name={`conditions[${index}].comparator`}
              label={'Condition'}
              style={{ marginBottom: 0, flex: '1 0' }}
              fastField
            >
              <FSelect
                name={`conditions[${index}].comparator`}
                items={getFieldConditionsByFieldKey(
                  get(values, `conditions[${index}].field`),
                )}
                popoverProps={{ minimal: true, inline: false }}
                shouldUpdateDeps={{
                  fieldKey: get(values, `conditions[${index}].field`),
                }}
                fastField
              />
            </FFormGroup>

            <FFormGroup
              name={`conditions[${index}].value`}
              label={'Value'}
              style={{ marginBottom: 0, flex: '1 0 ', width: '40%' }}
              fastField
            >
              <FInputGroup name={`conditions[${index}].value`} fastField />
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

/**
 * Rule form actions buttons.
 * @returns {React.ReactNode}
 */
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
          type="submit"
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

function RuleApplyIfTransactionTypeField() {
  const { setFieldValue } = useFormikContext<RuleFormValues>();

  const handleItemChange = useCallback(
    (item: any) => {
      setFieldValue('applyIfTransactionType', item.value);
      setFieldValue('assignCategory', '');
      setFieldValue('assignAccountId', '');
    },
    [setFieldValue],
  );

  return (
    <FFormGroup
      name={'applyIfTransactionType'}
      label={'Apply to transactions are'}
      style={{ maxWidth: 350 }}
      fastField
    >
      <FSelect
        name={'applyIfTransactionType'}
        items={TransactionTypeOptions}
        popoverProps={{ minimal: true, inline: false }}
        onItemChange={handleItemChange}
        fastField
      />
    </FFormGroup>
  );
}

function RuleAssignCategoryField() {
  const { values, setFieldValue } = useFormikContext<RuleFormValues>();

  // Retrieves the transaction types if it is deposit or withdrawal.
  const transactionTypes = useMemo(
    () =>
      values?.applyIfTransactionType === 'deposit'
        ? MoneyInOptions
        : MoneyOutOptions,
    [values?.applyIfTransactionType],
  );

  // Handles the select item change.
  const handleItemChange = useCallback(
    (item: any) => {
      setFieldValue('assignCategory', item.value);
      setFieldValue('assignAccountId', '');
    },
    [setFieldValue],
  );

  return (
    <FFormGroup
      name={'assignCategory'}
      label={'Transaction type'}
      labelInfo={<Tag minimal>Required</Tag>}
      style={{ maxWidth: 300 }}
      fastField
    >
      <FSelect
        name={'assignCategory'}
        items={transactionTypes}
        popoverProps={{ minimal: true, inline: false }}
        valueAccessor={'value'}
        textAccessor={'name'}
        onItemChange={handleItemChange}
        fastField
      />
    </FFormGroup>
  );
}

function RuleAssignCategoryAccountField() {
  const { values } = useFormikContext<RuleFormValues>();
  const { accounts } = useRuleFormDialogBoot();

  const accountRoot = useMemo(
    () => getAccountRootFromMoneyCategory(values.assignCategory),
    [values.assignCategory],
  );

  return (
    <FFormGroup
      name={'assignAccountId'}
      label={'Account category'}
      labelInfo={<Tag minimal>Required</Tag>}
      style={{ maxWidth: 300 }}
      fastField
      shouldUpdateDeps={{ accountRoot }}
    >
      <AccountsSelect
        name={'assignAccountId'}
        items={accounts}
        filterByRootTypes={accountRoot}
        shouldUpdateDeps={{ accountRoot }}
        fastField
      />
    </FFormGroup>
  );
}
