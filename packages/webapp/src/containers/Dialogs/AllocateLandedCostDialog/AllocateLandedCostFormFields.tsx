import { Classes, Radio, Spinner } from '@blueprintjs/core';
import { x } from '@xstyled/emotion';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';
import { useAllocateLandedConstDialogContext } from './AllocateLandedCostDialogProvider';
import { AllocateLandedCostFormBody } from './AllocateLandedCostFormBody';
import { allocateCostToEntries, resetAllocatedCostEntries } from './utils';
import type {
  AllocateLandedCostFormEntry,
  AllocateLandedCostFormValues,
  LandedCostTransaction,
  LandedCostTransactionEntry,
} from './types';
import {
  If,
  FFormGroup,
  FSelect,
  FRadioGroup,
  FInputGroup,
  FieldRequiredHint,
} from '@/components';
import { AllocateLandedCostType } from '@/constants/allocateLandedCostType';
import { handleStringChange } from '@/utils';

type TransactionTypeOption = { name: string; value: string };

/**
 * Allocate landed cost form fields.
 */
export function AllocateLandedCostFormFields() {
  // Allocated landed cost dialog.
  const {
    costTransactionEntries,
    landedCostTransactions,
    isLandedCostTransactionsLoading,
  } = useAllocateLandedConstDialogContext();

  // FIXME: original code destructured `form` from useFormikContext and never used it — dropped.
  const { values, setFieldValue } =
    useFormikContext<AllocateLandedCostFormValues>();

  // Handle transaction type select change.
  const handleTransactionTypeChange = (type: TransactionTypeOption) => {
    const { items } = values;

    setFieldValue('transactionType', type.value);
    setFieldValue('transactionId', '');
    setFieldValue('transactionEntryId', '');
    setFieldValue('amount', '');
    setFieldValue('items', resetAllocatedCostEntries(items));
  };

  // Handle transaction select change.
  const handleTransactionChange = (transaction: LandedCostTransaction) => {
    const { items } = values;
    setFieldValue('transactionId', transaction.id);
    setFieldValue('transactionEntryId', '');
    setFieldValue('amount', '');
    setFieldValue('items', resetAllocatedCostEntries(items));
  };

  // Handle transaction entry select change.
  const handleTransactionEntryChange = (entry: LandedCostTransactionEntry) => {
    const { id, unallocatedCostAmount: unallocatedAmount } = entry;
    const { items, allocationMethod } = values;

    setFieldValue('amount', unallocatedAmount ?? 0);
    setFieldValue('transactionEntryId', id);
    setFieldValue(
      'items',
      allocateCostToEntries(
        unallocatedAmount ?? 0,
        allocationMethod,
        items as unknown as AllocateLandedCostFormEntry[],
      ),
    );
  };

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------Transaction type ----------- */}
      <FFormGroup
        name={'transactionType'}
        label={intl.get('transaction_type')}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FSelect
          name={'transactionType'}
          items={AllocateLandedCostType}
          onItemChange={handleTransactionTypeChange}
          filterable={false}
          valueAccessor={'value'}
          textAccessor={'name'}
          popoverProps={{ minimal: true }}
          fastField
        />
      </FFormGroup>

      {/*------------ Transaction  ----------- */}
      <FFormGroup
        name={'transactionId'}
        label={intl.get('transaction_id')}
        labelInfo={<FieldRequiredHint />}
        inline
      >
        <x.div position="relative" w="100%">
          <FSelect
            name={'transactionId'}
            items={landedCostTransactions || []}
            onItemChange={handleTransactionChange}
            filterable={false}
            valueAccessor={'id'}
            textAccessor={'name'}
            labelAccessor={'formattedUnallocatedCostAmount'}
            placeholder={intl.get(
              'landed_cost.dialog.label_select_transaction',
            )}
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

      {/*------------ Transaction line  ----------- */}
      <If condition={(costTransactionEntries?.length ?? 0) > 0}>
        <FFormGroup
          name={'transactionEntryId'}
          label={intl.get('transaction_line')}
          inline
          fastField
        >
          <FSelect
            name={'transactionEntryId'}
            items={costTransactionEntries}
            onItemChange={handleTransactionEntryChange}
            filterable={false}
            valueAccessor={'id'}
            textAccessor={'name'}
            labelAccessor={'formattedUnallocatedCostAmount'}
            placeholder={intl.get(
              'landed_cost.dialog.label_select_transaction_entry',
            )}
            popoverProps={{ minimal: true }}
            fastField
          />
        </FFormGroup>
      </If>

      {/*------------ Amount ----------- */}
      <FFormGroup
        name={'amount'}
        label={intl.get('amount')}
        inline={true}
        fastField
      >
        <FInputGroup
          name={'amount'}
          onBlur={(e) => {
            const amount = e.target.value;
            const { allocationMethod, items } = values;

            setFieldValue(
              'items',
              allocateCostToEntries(
                amount,
                allocationMethod,
                items as unknown as AllocateLandedCostFormEntry[],
              ),
            );
          }}
        />
      </FFormGroup>

      {/*------------ Allocation method ----------- */}
      <FFormGroup
        name={'allocationMethod'}
        label={intl.get('allocation_method')}
        inline
        fastField
      >
        <FRadioGroup
          name={'allocationMethod'}
          onChange={handleStringChange((_value: string) => {
            const { amount, items } = values;

            setFieldValue('allocationMethod', _value);
            setFieldValue(
              'items',
              allocateCostToEntries(
                amount,
                _value,
                items as unknown as AllocateLandedCostFormEntry[],
              ),
            );
          })}
          inline={true}
        >
          <Radio label={intl.get('quantity')} value="quantity" />
          <Radio label={intl.get('valuation')} value="value" />
        </FRadioGroup>
      </FFormGroup>

      {/*------------ Allocate Landed cost Table -----------*/}
      <AllocateLandedCostFormBody />
    </div>
  );
}
