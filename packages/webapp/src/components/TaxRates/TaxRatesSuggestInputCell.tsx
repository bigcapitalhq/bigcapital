// @ts-nocheck
import { Button, FormGroup, Intent } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs-formik/select';
import React, { useCallback } from 'react';
import intl from 'react-intl-universal';
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

  // Handle the tax rate cleared.
  const handleClear = useCallback(() => {
    updateData(index, id, null);
  }, [updateData, index, id]);

  const clearButton = cellValue ? (
    <Button
      icon={'cross'}
      minimal={true}
      small={true}
      aria-label={intl.get('clear')}
      onClick={handleClear}
    />
  ) : undefined;

  return (
    <FormGroup intent={error ? Intent.DANGER : null} {...formGroupProps}>
      <Suggest<any>
        selectedValue={cellValue}
        items={taxRates}
        valueAccessor={'id'}
        labelAccessor={'code'}
        textAccessor={'nameFormatted'}
        popoverProps={{ minimal: true, boundary: 'window' }}
        inputProps={{ placeholder: '', rightElement: clearButton }}
        fill={true}
        onItemChange={handleItemSelected}
        {...suggestProps}
      />
    </FormGroup>
  );
}

TaxRatesSuggestInputCell.cellType = CellType.Field;
