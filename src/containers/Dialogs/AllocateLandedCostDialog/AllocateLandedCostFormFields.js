import React from 'react';
import { FastField, Field, ErrorMessage } from 'formik';
import {
  Classes,
  FormGroup,
  RadioGroup,
  Radio,
  InputGroup,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { FormattedMessage as T, If } from 'components';
import intl from 'react-intl-universal';
import { inputIntent, handleStringChange } from 'utils';
import { FieldRequiredHint, ListSelect } from 'components';
import { CLASSES } from 'common/classes';
import allocateLandedCostType from 'common/allocateLandedCostType';

import AllocateLandedCostFormBody from './AllocateLandedCostFormBody';
import {
  transactionsSelectShouldUpdate,
  allocateCostToEntries,
  resetAllocatedCostEntries,
} from './utils';
import { useAllocateLandedConstDialogContext } from './AllocateLandedCostDialogProvider';

/**
 * Allocate landed cost form fields.
 */
export default function AllocateLandedCostFormFields() {
  // Allocated landed cost dialog.
  const { costTransactionEntries, landedCostTransactions } =
    useAllocateLandedConstDialogContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------Transaction type -----------*/}
      <FastField
        name={'transaction_type'}
        transactions={allocateLandedCostType}
        shouldUpdate={transactionsSelectShouldUpdate}
      >
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
                const { items } = values;

                setFieldValue('transaction_type', type.value);
                setFieldValue('transaction_id', '');
                setFieldValue('transaction_entry_id', '');

                setFieldValue('amount', '');
                setFieldValue('items', resetAllocatedCostEntries(items));
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
      <Field
        name={'transaction_id'}
        transactions={landedCostTransactions}
        shouldUpdate={transactionsSelectShouldUpdate}
      >
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'transaction_id'} />}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="transaction_id" />}
            className={classNames(CLASSES.FILL, 'form-group--transaction_id')}
            inline={true}
          >
            <ListSelect
              items={landedCostTransactions}
              onItemSelect={({ id }) => {
                const { items } = form.values;
                form.setFieldValue('transaction_id', id);
                form.setFieldValue('transaction_entry_id', '');

                form.setFieldValue('amount', '');
                form.setFieldValue('items', resetAllocatedCostEntries(items));
              }}
              filterable={false}
              selectedItem={value}
              selectedItemProp={'id'}
              textProp={'name'}
              labelProp={'id'}
              defaultText={intl.get('Select transaction')}
              popoverProps={{ minimal: true }}
            />
          </FormGroup>
        )}
      </Field>

      {/*------------ Transaction line  -----------*/}
      <If condition={costTransactionEntries.length > 0}>
        <Field
          name={'transaction_entry_id'}
          transactions={costTransactionEntries}
          shouldUpdate={transactionsSelectShouldUpdate}
        >
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
                items={costTransactionEntries}
                onItemSelect={({ id, unallocated_cost_amount }) => {
                  const { items, allocation_method } = form.values;

                  form.setFieldValue('transaction_entry_id', id);
                  form.setFieldValue('amount', unallocated_cost_amount);

                  form.setFieldValue(
                    'items',
                    allocateCostToEntries(
                      unallocated_cost_amount,
                      allocation_method,
                      items,
                    ),
                  );
                }}
                filterable={false}
                selectedItem={value}
                selectedItemProp={'id'}
                textProp={'name'}
                defaultText={intl.get('Select transaction entry')}
                popoverProps={{ minimal: true }}
              />
            </FormGroup>
          )}
        </Field>
      </If>

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
            <InputGroup
              {...field}
              onBlur={(e) => {
                const amount = e.target.value;
                const { allocation_method, items } = form.values;

                form.setFieldValue(
                  'items',
                  allocateCostToEntries(amount, allocation_method, items),
                );
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Allocation method -----------*/}
      <Field name={'allocation_method'}>
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
                const { amount, items } = form.values;

                form.setFieldValue('allocation_method', _value);
                form.setFieldValue(
                  'items',
                  allocateCostToEntries(amount, _value, items),
                );
              })}
              selectedValue={value}
              inline={true}
            >
              <Radio label={<T id={'quantity'} />} value="quantity" />
              <Radio label={<T id={'valuation'} />} value="value" />
            </RadioGroup>
          </FormGroup>
        )}
      </Field>

      {/*------------ Allocate Landed cost Table -----------*/}
      <AllocateLandedCostFormBody />
    </div>
  );
}
