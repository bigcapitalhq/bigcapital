// @ts-nocheck
import React, { useCallback, useMemo } from 'react';
import { MenuItem, Tag, Intent } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';
import { FormGroup } from '@blueprintjs/core';
import { CellType } from '@/constants';
import { keyBy } from 'lodash';

/**
 * Custom tag renderer for tax rates.
 */
const tagRenderer = (item) => {
  if (!item) return null;
  return item.name;
};

/**
 * Item predicate for filtering tax rates.
 */
const itemPredicate = (query, item) => {
  const normalizedQuery = query.toLowerCase();
  const normalizedName = item.name?.toLowerCase() || '';
  const normalizedCode = item.code?.toLowerCase() || '';

  return (
    normalizedName.includes(normalizedQuery) ||
    normalizedCode.includes(normalizedQuery)
  );
};

/**
 * Tax rates multi-select cell for item entries table.
 * Allows selecting multiple tax rates per line item.
 */
export function TaxRatesMultiSelectCell({
  column: { id, formGroupProps },
  row: { index },
  cell: { value: cellValue },
  payload: { errors, updateData, taxRates },
}) {
  const error = errors?.[index]?.[id];

  // Convert cellValue (array of IDs) to array of tax rate objects
  const selectedItems = useMemo(() => {
    if (!cellValue || !Array.isArray(cellValue)) return [];
    const taxRatesById = keyBy(taxRates, 'id');
    return cellValue
      .map((id) => taxRatesById[id])
      .filter(Boolean);
  }, [cellValue, taxRates]);

  // Handle item selection
  const handleItemSelect = useCallback(
    (item) => {
      const currentIds = cellValue || [];
      // Check if already selected
      if (currentIds.includes(item.id)) {
        return;
      }
      const newIds = [...currentIds, item.id];
      updateData(index, id, newIds);
    },
    [updateData, index, id, cellValue],
  );

  // Handle tag remove
  const handleTagRemove = useCallback(
    (_tag, tagIndex) => {
      const currentIds = cellValue || [];
      const newIds = currentIds.filter((_, i) => i !== tagIndex);
      updateData(index, id, newIds);
    },
    [updateData, index, id, cellValue],
  );

  // Custom item renderer
  const itemRenderer = useCallback(
    (item, { handleClick, modifiers }) => {
      if (!modifiers.matchesPredicate) {
        return null;
      }
      const isSelected = selectedItems.some((selected) => selected.id === item.id);
      const label = item.is_compound ? '(Compound)' : '';

      return (
        <MenuItem
          active={modifiers.active}
          disabled={modifiers.disabled}
          icon={isSelected ? 'tick' : 'blank'}
          key={item.id}
          onClick={handleClick}
          text={`${item.name} [${item.rate}%]`}
          label={label}
          shouldDismissPopover={false}
        />
      );
    },
    [selectedItems],
  );

  // Filter out already selected items from the list
  const availableItems = useMemo(() => {
    return taxRates || [];
  }, [taxRates]);

  return (
    <FormGroup intent={error ? Intent.DANGER : null} {...formGroupProps}>
      <MultiSelect
        items={availableItems}
        selectedItems={selectedItems}
        itemRenderer={itemRenderer}
        itemPredicate={itemPredicate}
        tagRenderer={tagRenderer}
        onItemSelect={handleItemSelect}
        onRemove={handleTagRemove}
        fill={true}
        popoverProps={{
          minimal: true,
          boundary: 'window',
          usePortal: true,
        }}
        tagInputProps={{
          placeholder: '',
          tagProps: {
            minimal: true,
          },
        }}
        resetOnSelect={true}
      />
    </FormGroup>
  );
}

TaxRatesMultiSelectCell.cellType = CellType.Field;
