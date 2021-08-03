import React, { useCallback, useState } from 'react';
import { MenuItem, Button } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import MultiSelect from 'components/MultiSelect';
import { FormattedMessage as T } from 'components';
import { safeInvoke } from 'utils';

/**
 * Items multi-select.
 */
export function ItemsMultiSelect({
  items,
  defaultText = <T id={'All items'} />,
  buttonProps,

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

  return (
    <MultiSelect
      items={items}
      noResults={<MenuItem disabled={true} text={<T id={'No items'} />} />}
      itemRenderer={itemRenderer}
      popoverProps={{ minimal: true }}
      filterable={true}
      onItemSelect={handleItemSelect}
      itemPredicate={filterItemsPredicater}
      {...multiSelectProps}
    >
      <Button
        text={
          countSelected === 0
            ? defaultText
            : intl.get('Selected items ({count})', { count: countSelected })
        }
        {...buttonProps}
      />
    </MultiSelect>
  );
}
