// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { InclusiveButtonOptions } from './constants';
import { Box, FFormGroup, FSelect } from '@/components';
import { composeEntriesOnEditInclusiveTax } from './utils';

/**
 * Invoice form actions.
 * @returns {React.ReactNode}
 */
export function InvoiceFormActions() {
  return (
    <InvoiceFormActionsRoot>
      <InvoiceExclusiveInclusiveSelect />
    </InvoiceFormActionsRoot>
  );
}

/**
 * Invoice exclusive/inclusive select.
 * @returns {React.ReactNode}
 */
export function InvoiceExclusiveInclusiveSelect(props) {
  const { values, setFieldValue } = useFormikContext();

  const handleItemSelect = (item) => {
    const newEntries = composeEntriesOnEditInclusiveTax(
      item.key,
      values.entries,
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
      <InclusiveSelect
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
  margin-bottom: 0;
  margin-left: auto;

  &.bp3-form-group.bp3-inline label.bp3-label {
    line-height: 1.25;
    opacity: 0.6;
    margin-right: 8px;
  }
`;

const InclusiveSelect = styled(FSelect)`
  .bp3-button {
    padding-right: 24px;
  }
`;

const InvoiceFormActionsRoot = styled(Box)`
  padding-bottom: 12px;
  display: flex;
`;
