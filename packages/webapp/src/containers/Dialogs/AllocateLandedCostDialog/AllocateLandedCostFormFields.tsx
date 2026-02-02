// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { ErrorMessage, useFormikContext } from 'formik';
import {
  Classes,
  FormGroup,
  RadioGroup,
  Radio,
  InputGroup,
  Spinner,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { x } from '@xstyled/emotion';
import { FormattedMessage as T, If, FFormGroup, FSelect, FRadioGroup, FInputGroup } from '@/components';
import { handleStringChange } from '@/utils';
import { FieldRequiredHint } from '@/components';
import { CLASSES } from '@/constants/classes';
import { AllocateLandedCostType } from '@/constants/allocateLandedCostType';

import AllocateLandedCostFormBody from './AllocateLandedCostFormBody';
import {
  allocateCostToEntries,
  resetAllocatedCostEntries,
} from './utils';
import { useAllocateLandedConstDialogContext } from './AllocateLandedCostDialogProvider';

/**
 * Allocate landed cost form fields.
 */
export default function AllocateLandedCostFormFields() {
  // Allocated landed cost dialog.
  const { costTransactionEntries, landedCostTransactions, isLandedCostTransactionsLoading } =
    useAllocateLandedConstDialogContext();

  const { values, setFieldValue, form } = useFormikContext();

  // Handle transaction type select change.
  const handleTransactionTypeChange = (type) => {
    const { items } = values;

    setFieldValue('transaction_type', type.value);
    setFieldValue('transaction_id', '');
    setFieldValue('transaction_entry_id', '');
    setFieldValue('amount', '');
    setFieldValue('items', resetAllocatedCostEntries(items));
  };

  // Handle transaction select change.
  const handleTransactionChange = (transaction) => {
    const { items } = values;
    setFieldValue('transaction_id', transaction.id);
    setFieldValue('transaction_entry_id', '');
    setFieldValue('amount', '');
    setFieldValue('items', resetAllocatedCostEntries(items));
  };

  // Handle transaction entry select change.
  const handleTransactionEntryChange = (entry) => {
    const { id, unallocated_cost_amount: unallocatedAmount } = entry;
    const { items, allocation_method } = values;

    setFieldValue('amount', unallocatedAmount);
    setFieldValue('transaction_entry_id', id);
    setFieldValue(
      'items',
      allocateCostToEntries(unallocatedAmount, allocation_method, items),
    );
  };

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------Transaction type -----------*/}
      <FFormGroup
        name={'transaction_type'}
        label={<T id={'transaction_type'} />}
        labelInfo={<FieldRequiredHint />}
        inline
        fill
        fastField
      >
        <FSelect
          name={'transaction_type'}
          items={AllocateLandedCostType}
          onItemChange={handleTransactionTypeChange}
          filterable={false}
          valueAccessor={'value'}
          textAccessor={'name'}
          popoverProps={{ minimal: true }}
          fastField
        />
      </FFormGroup>

      {/*------------ Transaction  -----------*/}
      <FFormGroup
        name={'transaction_id'}
        label={<T id={'transaction_id'} />}
        labelInfo={<FieldRequiredHint />}
        inline
        fill
      >
        <x.div position="relative" w="100%">
          <FSelect
            name={'transaction_id'}
            items={landedCostTransactions || []}
            onItemChange={handleTransactionChange}
            filterable={false}
            valueAccessor={'id'}
            textAccessor={'name'}
            labelAccessor={'formatted_unallocated_cost_amount'}
            placeholder={intl.get('landed_cost.dialog.label_select_transaction')}
            popoverProps={{ minimal: true }}
            disabled={isLandedCostTransactionsLoading}
          />
          {isLandedCostTransactionsLoading && (
            <x.div
              position="absolute"
              right="35px"
              top="50%"
              transform="translateY(-50%)"
              pointerEvents="none"
            >
              <Spinner size={16} />
            </x.div>
          )}
        </x.div>
      </FFormGroup>

      {/*------------ Transaction line  -----------*/}
      <If condition={costTransactionEntries?.length > 0}>
        <FFormGroup
          name={'transaction_entry_id'}
          label={<T id={'transaction_line'} />}
          inline
          fill
          fastField
        >
          <FSelect
            name={'transaction_entry_id'}
            items={costTransactionEntries}
            onItemChange={handleTransactionEntryChange}
            filterable={false}
            valueAccessor={'id'}
            textAccessor={'name'}
            labelAccessor={'formatted_unallocated_cost_amount'}
            placeholder={intl.get(
              'landed_cost.dialog.label_select_transaction_entry',
            )}
            popoverProps={{ minimal: true }}
            fastField
          />
        </FFormGroup>
      </If>

      {/*------------ Amount -----------*/}
      <FFormGroup
        name={'amount'}
        label={<T id={'amount'} />}
        inline={true}
        fastField
      >
        <FInputGroup
          name={'amount'}
          onBlur={(e) => {
            const amount = e.target.value;
            const { allocation_method, items } = values;

            setFieldValue(
              'items',
              allocateCostToEntries(amount, allocation_method, items),
            );
          }}
        />
      </FFormGroup>

      {/*------------ Allocation method -----------*/}
      <FFormGroup
        name={'allocation_method'}
        label={<T id={'allocation_method'} />}
        medium
        inline
        fastField
      >
        <FRadioGroup
          name={'allocation_method'}
          onChange={handleStringChange((_value) => {
            const { amount, items } = values;

            setFieldValue('allocation_method', _value);
            setFieldValue(
              'items',
              allocateCostToEntries(amount, _value, items),
            );
          })}
          inline={true}
        >
          <Radio label={<T id={'quantity'} />} value="quantity" />
          <Radio label={<T id={'valuation'} />} value="value" />
        </FRadioGroup>
      </FFormGroup>

      {/*------------ Allocate Landed cost Table -----------*/}
      <AllocateLandedCostFormBody />
    </div>
  );
}
