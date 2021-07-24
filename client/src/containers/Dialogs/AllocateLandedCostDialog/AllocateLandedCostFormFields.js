import React from 'react';
import { FastField, Field, ErrorMessage, useFormikContext } from 'formik';
import {
  Classes,
  FormGroup,
  RadioGroup,
  Radio,
  InputGroup,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
import { inputIntent, handleStringChange } from 'utils';
import { FieldRequiredHint, ListSelect } from 'components';
import { CLASSES } from 'common/classes';
import allocateLandedCostType from 'common/allocateLandedCostType';
import { useLandedCostTransaction } from 'hooks/query';

import AllocateLandedCostFormBody from './AllocateLandedCostFormBody';
import { getEntriesByTransactionId } from './utils';

/**
 * Allocate landed cost form fields.
 */
export default function AllocateLandedCostFormFields() {
  const { values } = useFormikContext();

  const {
    data: { transactions },
  } = useLandedCostTransaction(values.transaction_type);

  const transactionEntry = getEntriesByTransactionId(
    transactions,
    values.transaction_id,
  );

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------Transaction type -----------*/}
      <FastField name={'transaction_type'}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={<T id={'transaction_type'} />}
            labelInfo={<FieldRequiredHint />}
            helperText={<ErrorMessage name="transaction_type" />}
            intent={inputIntent({ error, touched })}
            inline={true}
            className={classNames(CLASSES.FILL, 'form-group--transaction_type')}
          >
            <ListSelect
              items={allocateLandedCostType}
              onItemSelect={(type) => {
                setFieldValue('transaction_type', type.value);
              }}
              filterable={false}
              selectedItem={value}
              selectedItemProp={'value'}
              textProp={'name'}
              popoverProps={{ minimal: true }}
            />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Transaction  -----------*/}
      <Field name={'transaction_id'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'transaction_id'} />}
            // labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="transaction_id" />}
            className={classNames(CLASSES.FILL, 'form-group--transaction_id')}
            inline={true}
          >
            <ListSelect
              items={transactions}
              onItemSelect={({ id }) => {
                form.setFieldValue('transaction_id', id);
              }}
              filterable={false}
              selectedItem={value}
              selectedItemProp={'id'}
              textProp={'name'}
              labelProp={'id'}
              defaultText={intl.get('select_transaction')}
              popoverProps={{ minimal: true }}
            />
          </FormGroup>
        )}
      </Field>

      {/*------------ Transaction line  -----------*/}
      <Field name={'transaction_entry_id'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'transaction_line'} />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="transaction_entry_id" />}
            className={classNames(
              CLASSES.FILL,
              'form-group--transaction_entry_id',
            )}
            inline={true}
          >
            <ListSelect
              items={transactionEntry}
              onItemSelect={({ id }) => {
                form.setFieldValue('transaction_entry_id', id);
              }}
              filterable={false}
              selectedItem={value}
              selectedItemProp={'id'}
              textProp={'name'}
              labelProp={'id'}
              defaultText={intl.get('select_transaction')}
              popoverProps={{ minimal: true }}
            />
          </FormGroup>
        )}
      </Field>

      {/*------------ Amount -----------*/}
      <FastField name={'amount'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'amount'} />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="amount" />}
            className={'form-group--amount'}
            inline={true}
          >
            <InputGroup {...field} />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Allocation method -----------*/}
      <FastField name={'allocation_method'}>
        {({ form, field: { value }, meta: { touched, error } }) => (
          <FormGroup
            medium={true}
            label={<T id={'allocation_method'} />}
            labelInfo={<FieldRequiredHint />}
            className={'form-group--allocation_method'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="allocation_method" />}
            inline={true}
          >
            <RadioGroup
              onChange={handleStringChange((_value) => {
                form.setFieldValue('allocation_method', _value);
              })}
              selectedValue={value}
              inline={true}
            >
              <Radio label={<T id={'quantity'} />} value="quantity" />
              <Radio label={<T id={'valuation'} />} value="value" />
            </RadioGroup>
          </FormGroup>
        )}
      </FastField>

      {/*------------ Allocate Landed cost Table -----------*/}
      <AllocateLandedCostFormBody />
    </div>
  );
}
