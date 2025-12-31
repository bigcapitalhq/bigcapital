// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { InclusiveButtonOptions } from './constants';
import { FFormGroup, FSelect } from '@/components';
import { EntriesActionsBar } from '@/containers/Entries/EntriesActionBar';
import { composeEntriesOnEditInclusiveTax } from './utils';
import { useInvoiceFormContext } from './InvoiceFormProvider';

/**
 * Invoice form actions.
 * @returns {React.ReactNode}
 */
export function InvoiceFormActions() {
  return (
    <EntriesActionsBar>
      <InvoiceExclusiveInclusiveSelect />
    </EntriesActionsBar>
  );
}

/**
 * Invoice exclusive/inclusive select.
 * @returns {React.ReactNode}
 */
export function InvoiceExclusiveInclusiveSelect(props) {
  const { values, setFieldValue } = useFormikContext();
  const { taxRates } = useInvoiceFormContext();

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
