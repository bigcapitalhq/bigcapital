import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { FormattedMessage as T } from 'react-intl';
import { ListSelect } from 'components';
import { MenuItem } from '@blueprintjs/core';

export default function ContactSelecetList({
  contactsList,
  selectedContactId,
  defaultSelectText = <T id={'select_contact'} />,
  onContactSelected,
  // disabled = false,
  ...restProps
}) {
  const [selecetedContact, setSelectedContact] = useState(null);

  // Filter Contact List
  const FilterContacts = (query, contact, index, exactMatch) => {
    const normalizedTitle = contact.display_name.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return (
        `${contact.display_name} ${normalizedTitle}`.indexOf(normalizedQuery) >=
        0
      );
    }
  };
 
  const onContactSelect = useCallback(
    (contact) => {
      setSelectedContact({ ...contact });
      onContactSelected && onContactSelected(contact);
    },
    [setSelectedContact, onContactSelected],
  );

  const handleContactRenderer = useCallback(
    (contact, { handleClick }) => (
      <MenuItem
        key={contact.id}
        text={contact.display_name}
        onClick={handleClick}
      />
    ),
    [],
  );

  return (
    <ListSelect
      items={contactsList}
      selectedItemProp={'id'}
      selectedItem={selectedContactId}
      labelProp={'display_name'}
      defaultText={defaultSelectText}
      onItemSelect={onContactSelect}
      itemPredicate={FilterContacts}
      itemRenderer={handleContactRenderer}
      popoverProps={{ minimal: true }}
      {...restProps}
    />
  );
}
