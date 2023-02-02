// @ts-nocheck
import React, { useCallback } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@/components';

/**
 * Items multi-select.
 */
export function ItemsMultiSelect({ ...multiSelectProps }) {
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
      itemRenderer={(item, { selected, handleClick, active }) => (
        <MenuItem
          active={active}
          icon={selected ? 'tick' : 'blank'}
          text={item.name}
          label={item.code}
          key={item.id}
          onClick={handleClick}
        />
      )}
      popoverProps={{ minimal: true, usePortal: false, targetTagName: 'div ' }}
      fill={true}
      itemPredicate={filterItemsPredicater}
      tagRenderer={(item) => item.name}
      resetOnSelect={true}
      {...multiSelectProps}
    />
  );
}

ItemsMultiSelect.defaultProps = {
  initialSelectedItems: [],
};
