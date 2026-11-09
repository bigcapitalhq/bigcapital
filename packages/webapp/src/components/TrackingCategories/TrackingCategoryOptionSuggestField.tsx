import { MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs-formik/select';
import React from 'react';
import type { ItemRendererProps } from '@blueprintjs/select';

export interface TrackingCategoryOptionSuggestItem {
  id: number;
  name: string;
  active?: boolean | number;
}

interface TrackingCategoryOptionSuggestFieldProps {
  options: TrackingCategoryOptionSuggestItem[];
  selectedOptionId?: number;
  disabled?: boolean;
  placeholder: string;
  onOptionSelect: (option: TrackingCategoryOptionSuggestItem) => void;
  onClear: () => void;
}

type SuggestItem = TrackingCategoryOptionSuggestItem & {
  value: number;
  text: string;
  label: string;
};

/**
 * Tracking category option suggest field.
 *
 * Uses the same searchable Suggest field as the account column instead of a
 * native select. Clicking the selected option again clears the assignment.
 */
export function TrackingCategoryOptionSuggestField({
  options,
  selectedOptionId,
  disabled = false,
  placeholder,
  onOptionSelect,
  onClear,
}: TrackingCategoryOptionSuggestFieldProps): React.ReactElement {
  const items = React.useMemo<SuggestItem[]>(() => {
    return options.map((option) => ({
      ...option,
      value: option.id,
      text: option.name,
      label: '',
    }));
  }, [options]);

  const itemRenderer = React.useCallback(
    (item: SuggestItem, { handleClick, modifiers }: ItemRendererProps) => {
      if (!modifiers.matchesPredicate) {
        return null;
      }
      return (
        <MenuItem
          key={item.value}
          active={modifiers.active}
          disabled={modifiers.disabled}
          text={item.text}
          onClick={handleClick}
        />
      );
    },
    [],
  );

  const handleItemSelect = React.useCallback(
    (item: SuggestItem) => {
      if (item.id === selectedOptionId) {
        onClear();
      } else {
        onOptionSelect(item);
      }
    },
    [onClear, onOptionSelect, selectedOptionId],
  );

  return (
    <Suggest<SuggestItem>
      items={items}
      selectedValue={selectedOptionId}
      valueAccessor={'value'}
      textAccessor={'text'}
      labelAccessor={'label'}
      itemRenderer={itemRenderer}
      onItemSelect={handleItemSelect}
      inputProps={{ disabled, placeholder }}
      openOnKeyDown={!disabled}
      resetOnClose={true}
      popoverProps={{ minimal: true, boundary: 'window' }}
    />
  );
}
