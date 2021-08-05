import React, { useCallback, useState } from 'react';
import { MenuItem, Button, Intent } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';
import { FormattedMessage as T } from 'components';
import { safeInvoke } from 'utils';

/**
 * Items multi-select.
 */
export function ItemsMultiSelect({
  items,
  defaultText = <T id={'All items'} />,
  buttonProps,
  onTagRenderer,
  selectedItems = [],
  onItemSelect,
  ...multiSelectProps
}) {
  const [localSelected, setLocalSelected] = useState([...selectedItems]);

  // Detarmines the given id is selected.
  const isItemSelected = useCallback(
    (id) => localSelected.some((s) => s === id),
    [localSelected],
  );

  // Contact item renderer.
  const itemRenderer = useCallback(
    (item, { handleClick }) => (
      <MenuItem
        icon={isItemSelected(item.id) ? 'tick' : 'blank'}
        text={item.name}
        label={item.code}
        key={item.id}
        onClick={handleClick}
      />
    ),
    [isItemSelected],
  );

  // Count selected items.
  const countSelected = localSelected.length;

  // Handle item selected.
  const handleItemSelect = useCallback(
    ({ id }) => {
      const selected = isItemSelected(id)
        ? localSelected.filter((s) => s !== id)
        : [...localSelected, id];

      setLocalSelected([...selected]);
      safeInvoke(onItemSelect, selected);
    },
    [setLocalSelected, localSelected, isItemSelected, onItemSelect],
  );

  const itemsSelected = () => {
    const results = [];
    items.map(({ id, name }) => {
      return isItemSelected(id) ? results.push(name) : [];
    });
    return results;
  };

  // Filters accounts items.
  const filterItemsPredicater = useCallback(
    (query, item, _index, exactMatch) => {
      const normalizedTitle = item.name.toLowerCase();
      const normalizedQuery = query.toLowerCase();

      if (exactMatch) {
        return normalizedTitle === normalizedQuery;
      } else {
        return `${normalizedTitle} ${item.code}`.indexOf(normalizedQuery) >= 0;
      }
    },
    [],
  );

  // Clear Button
  const clearButton =
    countSelected > 0 ? (
      <Button
        icon="cross"
        minimal={true}
        onClick={() => setLocalSelected([])}
      />
    ) : undefined;

  // handle remove tag
  const handleTagRemove = (tag) => {
    let tagList = localSelected.filter((s) => s !== tag);
    setLocalSelected(tagList);
  };

  return (
    <MultiSelect
      items={items}
      noResults={<MenuItem disabled={true} text={<T id={'No items'} />} />}
      itemRenderer={itemRenderer}
      popoverProps={{
        minimal: true,
        usePortal: false,
        targetTagName: 'div ',
      }}
      selectedItems={itemsSelected()}
      fill={true}
      onItemSelect={handleItemSelect}
      itemPredicate={filterItemsPredicater}
      tagRenderer={onTagRenderer}
      tagInputProps={{
        tagProps: { intent: Intent.NONE, minimal: false },
        onRemove: handleTagRemove,
        // rightElement: clearButton,
      }}
      resetOnSelect={true}
      // openOnKeyDown={true}
      {...multiSelectProps}
    />
  );
}
