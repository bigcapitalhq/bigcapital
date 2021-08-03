import React, { useCallback, useState } from 'react';
import { MenuItem, Button } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import MultiSelect from 'components/MultiSelect';
import { FormattedMessage as T } from 'components';
import { safeInvoke } from 'utils';

/**
 * Contacts multi-select component.
 */
export default function ContactsMultiSelect({
  contacts,
  defaultText = <T id={'all_customers'} />,
  buttonProps,

  onContactSelect,
  contactsSelected = [],
  ...multiSelectProps
}) {
  const [localSelected, setLocalSelected] = useState([...contactsSelected]);

  // Detarmines the given id is selected.
  const isItemSelected = useCallback(
    (id) => localSelected.some((s) => s === id),
    [localSelected],
  );

  // Contact item renderer.
  const contactRenderer = useCallback(
    (contact, { handleClick }) => (
      <MenuItem
        icon={isItemSelected(contact.id) ? 'tick' : 'blank'}
        text={contact.display_name}
        key={contact.id}
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
      safeInvoke(onContactSelect, selected);
    },
    [setLocalSelected, localSelected, isItemSelected, onContactSelect],
  );

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
      items={contacts}
      noResults={<MenuItem disabled={true} text={<T id={'no_results'} />} />}
      itemRenderer={contactRenderer}
      popoverProps={{ minimal: true }}
      filterable={true}
      onItemSelect={handleItemSelect}
      itemPredicate={filterContactsPredicater}
      {...multiSelectProps}
    >
      <Button
        text={
          countSelected === 0
            ? defaultText
            : intl.get('selected_customers', { count: countSelected })
        }
        {...buttonProps}
      />
    </MultiSelect>
  );
}
