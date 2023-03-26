// @ts-nocheck
import React from 'react';
import { FastField, Field, ErrorMessage, useFormikContext } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import {
  Classes,
  FormGroup,
  InputGroup,
  TextArea,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import classNames from 'classnames';
import {
  FormattedMessage as T,
  AccountsSuggestField,
  InputPrependText,
  MoneyInputGroup,
  FieldRequiredHint,
  InputPrependButton,
  Icon,
  If,
  Col,
  Row,
  FeatureCan,
  BranchSelect,
  BranchSelectButton,
  ExchangeRateMutedField,
} from '@/components';
import { useAutofocus } from '@/hooks';
import { CLASSES, Features, ACCOUNT_TYPE } from '@/constants';
import {
  inputIntent,
  momentFormatter,
  tansformDateValue,
  handleDateChange,
  compose,
} from '@/utils';
import { useMoneyOutDialogContext } from '../MoneyOutDialogProvider';
import {
  useObserveTransactionNoSettings,
  useSetPrimaryBranchToForm,
  useForeignAccount,
  BranchRowDivider,
} from '../../MoneyOutDialog/utils';
import withSettings from '@/containers/Settings/withSettings';
import withDialogActions from '@/containers/Dialog/withDialogActions';

/**
 * Owner drawings form fields.
 */
function OwnerDrawingsFormFields({
  // #withDialogActions
  openDialog,

  // #withSettings
  transactionAutoIncrement,
  transactionNumberPrefix,
  transactionNextNumber,
}) {
  // Money out dialog context.
  const { accounts, account, branches } = useMoneyOutDialogContext();
  const { values } = useFormikContext();
  const isForeigAccount = useForeignAccount();

  const amountFieldRef = useAutofocus();

  // Handle tranaction number changing.
  const handleTransactionNumberChange = () => {
    openDialog('transaction-number-form');
  };

  // Handle transaction no. field blur.
  const handleTransactionNoBlur = (form, field) => (event) => {
    const newValue = event.target.value;

    if (field.value !== newValue && transactionAutoIncrement) {
      openDialog('transaction-number-form', {
        initialFormValues: {
          manualTransactionNo: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
  };

  // Syncs transaction number settings with form.
  useObserveTransactionNoSettings(
    transactionNumberPrefix,
    transactionNextNumber,
  );

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  return (
    <React.Fragment>
      <FeatureCan feature={Features.Branches}>
        <Row>
          <Col xs={5}>
            <FormGroup
              label={<T id={'branch'} />}
              className={classNames('form-group--select-list', Classes.FILL)}
            >
              <BranchSelect
                name={'branch_id'}
                branches={branches}
                input={BranchSelectButton}
                popoverProps={{ minimal: true }}
              />
            </FormGroup>
          </Col>
        </Row>
        <BranchRowDivider />
      </FeatureCan>
      <Row>
        <Col xs={5}>
          {/*------------ Date -----------*/}
          <FastField name={'date'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'date'} />}
                labelInfo={<FieldRequiredHint />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="date" />}
                minimal={true}
                className={classNames(CLASSES.FILL, 'form-group--date')}
              >
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  onChange={handleDateChange((formattedDate) => {
                    form.setFieldValue('date', formattedDate);
                  })}
                  value={tansformDateValue(value)}
                  popoverProps={{
                    position: Position.BOTTOM,
                    minimal: true,
                  }}
                  intent={inputIntent({ error, touched })}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
        <Col xs={5}>
          {/*------------ Transaction number -----------*/}
          <Field name={'transaction_number'}>
            {({ form, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'transaction_number'} />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="transaction_number" />}
                className={'form-group--transaction_number'}
              >
                <ControlGroup fill={true}>
                  <InputGroup
                    minimal={true}
                    value={field.value}
                    asyncControl={true}
                    onBlur={handleTransactionNoBlur(form, field)}
                  />
                  <InputPrependButton
                    buttonProps={{
                      onClick: handleTransactionNumberChange,
                      icon: <Icon icon={'settings-18'} />,
                    }}
                    tooltip={true}
                    tooltipProps={{
                      content: (
                        <T
                          id={
                            'cash_flow.setting_your_auto_generated_transaction_number'
                          }
                        />
                      ),
                      position: Position.BOTTOM_LEFT,
                    }}
                  />
                </ControlGroup>
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>
      {/*------------ amount -----------*/}
      <Field name={'amount'}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={<T id={'amount'} />}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="amount" />}
            className={'form-group--amount'}
          >
            <ControlGroup>
              <InputPrependText text={account.currency_code} />

              <MoneyInputGroup
                value={value}
                minimal={true}
                onChange={(amount) => {
                  setFieldValue('amount', amount);
                }}
                inputRef={(ref) => (amountFieldRef.current = ref)}
                intent={inputIntent({ error, touched })}
              />
            </ControlGroup>
          </FormGroup>
        )}
      </Field>

      <If condition={isForeigAccount}>
        {/*------------ exchange rate -----------*/}
        <ExchangeRateMutedField
          name={'exchange_rate'}
          fromCurrency={values?.currency_code}
          toCurrency={account?.currency_code}
          formGroupProps={{ label: '', inline: false }}
          date={values.date}
          exchangeRate={values.exchange_rate}
        />
      </If>
      <Row>
        <Col xs={5}>
          {/*------------ equitty account -----------*/}
          <FastField name={'credit_account_id'}>
            {({ form, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'cash_flow_transaction.label_equity_account'} />}
                labelInfo={<FieldRequiredHint />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="credit_account_id" />}
                className={'form-group--credit_account_id'}
              >
                <AccountsSuggestField
                  accounts={accounts}
                  onAccountSelected={({ id }) =>
                    form.setFieldValue('credit_account_id', id)
                  }
                  filterByTypes={ACCOUNT_TYPE.EQUITY}
                  inputProps={{
                    intent: inputIntent({ error, touched }),
                  }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
        <Col xs={5}>
          {/*------------ Reference -----------*/}
          <FastField name={'reference_no'}>
            {({ form, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'reference_no'} />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="reference_no" />}
                className={'form-group--reference-no'}
              >
                <InputGroup
                  intent={inputIntent({ error, touched })}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      {/*------------ description -----------*/}
      <FastField name={'description'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'description'} />}
            className={'form-group--description'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'description'} />}
          >
            <TextArea
              growVertically={true}
              large={true}
              intent={inputIntent({ error, touched })}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </React.Fragment>
  );
}

export default compose(
  withDialogActions,
  withSettings(({ cashflowSetting }) => ({
    transactionAutoIncrement: cashflowSetting?.autoIncrement,
    transactionNextNumber: cashflowSetting?.nextNumber,
    transactionNumberPrefix: cashflowSetting?.numberPrefix,
  })),
)(OwnerDrawingsFormFields);
