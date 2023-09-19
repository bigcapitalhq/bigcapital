// @ts-nocheck
import React, { useCallback } from 'react';
import { Suggest } from '@blueprintjs-formik/select';
import { FormGroup } from '@blueprintjs/core';
import { CellType } from '@/constants';

export function TaxRatesSuggestInputCell({
  column: { id, suggestProps, formGroupProps },
  row: { index },
  cell: { value: cellValue },
  payload: { errors, updateData, taxRates },
}) {
  const error = errors?.[index]?.[id];

  // Handle the item selected.
  const handleItemSelected = useCallback(
    (value, taxRate) => {
      updateData(index, id, taxRate.id);
    },
    [updateData, index, id],
  );

  return (
    <FormGroup intent={error ? Intent.DANGER : null} {...formGroupProps}>
      <Suggest<any>
        selectedValue={cellValue}
        items={taxRates}
        valueAccessor={'id'}
        labelAccessor={'code'}
        textAccessor={'name_formatted'}
        popoverProps={{ minimal: true, boundary: 'window' }}
        inputProps={{ placeholder: '' }}
        fill={true}
        onItemChange={handleItemSelected}
        {...suggestProps}
      />
    </FormGroup>
  );
}

TaxRatesSuggestInputCell.cellType = CellType.Field;
