// @ts-nocheck
import React, { useCallback, useState } from 'react';
import { includes } from 'lodash';
import { MenuItem } from '@blueprintjs/core';
import { MultiSelect as MultiSelectBP } from '@blueprintjs/select';
import { FormattedMessage as T } from '@/components';
import { safeInvoke } from '@/utils';

/**
 * Items multi-select.
 */
export function MultiSelect({
  items,
  initialSelectedItems,
  onItemSelect,
  ...multiSelectProps
}) {
  const [localSelected, setLocalSelected] = useState(initialSelectedItems);

  // Determines whether the given id is selected.
  const isItemSelected = useCallback(
    (item) => includes(localSelected, item),
    [localSelected],
  );

  // Removes the given item from selected items.
  const removeSelectedItem = React.useCallback(
    (item) => localSelected.filter((localItem) => localItem !== item),
    [localSelected],
  );

  // Adds the given item to selected items.
  const addSelectedItem = React.useCallback(
    (item) => [...localSelected, item],
    [localSelected],
  );

  // Handle item selected.
  const handleItemSelect = useCallback(
    (item) => {
      const selected = isItemSelected(item)
        ? removeSelectedItem(item)
        : addSelectedItem(item);

      setLocalSelected(selected);
      safeInvoke(onItemSelect, selected);
    },
    [addSelectedItem, removeSelectedItem, isItemSelected, onItemSelect],
  );

  // handle remove tag
  const handleTagRemove = (item) => {
    const selected = removeSelectedItem(item);

    setLocalSelected(selected);
    safeInvoke(onItemSelect, selected);
  };
  const itemRenderer = (item, props) => {
    return multiSelectProps.itemRenderer(item, {
      selected: isItemSelected(item),
      ...props,
    });
  };

  return (
    <MultiSelectBP
      items={items}
      noResults={<MenuItem disabled={true} text={<T id={'No items'} />} />}
      tagInputProps={{
        onRemove: handleTagRemove,
      }}
      {...multiSelectProps}
      itemRenderer={itemRenderer}
      selectedItems={localSelected}
      onItemSelect={handleItemSelect}
    />
  );
}

MultiSelect.defaultProps = {
  initialSelectedItems: [],
};
