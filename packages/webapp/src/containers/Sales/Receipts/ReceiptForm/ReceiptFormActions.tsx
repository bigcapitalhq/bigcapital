// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { FFormGroup, FSelect } from '@/components';
import { EntriesActionsBar } from '@/containers/Entries/EntriesActionBar';
import { composeEntriesOnEditInclusiveTax } from './utils';
import { useReceiptFormContext } from './ReceiptFormProvider';
import { TaxType } from '@/interfaces/TaxRates';

const InclusiveButtonOptions = [
  { key: TaxType.Inclusive, label: 'Inclusive of Tax' },
  { key: TaxType.Exclusive, label: 'Exclusive of Tax' },
];

/**
 * Receipt form actions.
 * @returns {React.ReactNode}
 */
export function ReceiptFormActions() {
  return (
    <EntriesActionsBar>
      <ReceiptExclusiveInclusiveSelect />
    </EntriesActionsBar>
  );
}

/**
 * Receipt exclusive/inclusive select.
 * @returns {React.ReactNode}
 */
export function ReceiptExclusiveInclusiveSelect(props) {
  const { values, setFieldValue } = useFormikContext();
  const { taxRates } = useReceiptFormContext();

  const handleItemSelect = (item) => {
    const newEntries = composeEntriesOnEditInclusiveTax(
      item.key,
      values.entries,
      taxRates,
    );
    setFieldValue('inclusive_exclusive_tax', item.key);
    setFieldValue('entries', newEntries);
  };

  return (
    <InclusiveFormGroup
      name={'inclusive_exclusive_tax'}
      label={'Amounts are'}
      inline={true}
    >
      <FSelect
        name={'inclusive_exclusive_tax'}
        items={InclusiveButtonOptions}
        textAccessor={'label'}
        labelAccessor={() => ''}
        valueAccessor={'key'}
        popoverProps={{ minimal: true, usePortal: true, inline: false }}
        buttonProps={{ small: true }}
        onItemSelect={handleItemSelect}
        filterable={false}
        {...props}
      />
    </InclusiveFormGroup>
  );
}

const InclusiveFormGroup = styled(FFormGroup)`
  margin-left: auto;
`;
