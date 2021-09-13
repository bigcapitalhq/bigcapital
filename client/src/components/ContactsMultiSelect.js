import React, { useCallback } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '../components/MultiSelectTaggable';

/**
 * Contacts multi-select component.
 */
export default function ContactsMultiSelect({ ...multiSelectProps }) {
  // Filters accounts items.
  const filterContactsPredicater = useCallback(
    (query, contact, _index, exactMatch) => {
      const normalizedTitle = contact.display_name.toLowerCase();
      const normalizedQuery = query.toLowerCase();

      if (exactMatch) {
        return normalizedTitle === normalizedQuery;
      } else {
        return normalizedTitle.indexOf(normalizedQuery) >= 0;
      }
    },
    [],
  );

  return (
    <MultiSelect
      itemRenderer={(contact, { selected, active, handleClick }) => (
        <MenuItem
          active={active}
          icon={selected ? 'tick' : 'blank'}
          text={contact.display_name}
          key={contact.id}
          onClick={handleClick}
        />
      )}
      popoverProps={{ minimal: true }}
      fill={true}
      itemPredicate={filterContactsPredicater}
      tagRenderer={(item) => item.display_name}
      {...multiSelectProps}
    />
  );
}
