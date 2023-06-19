// @ts-nocheck
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';

import { FormattedMessage as T } from '@/components';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import intl from 'react-intl-universal';

export function ContactsSuggestField({
  contactsList,
  initialContactId,
  selectedContactId,
  defaultTextSelect = intl.get('select_contact'),
  onContactSelected,

  selectedContactType = [],
  popoverFill = false,

  ...suggestProps
}) {
  // filteredContacts
  const contacts = useMemo(
    () =>
      contactsList.map((contact) => ({
        ...contact,
        _id: `${contact.id}_${contact.contact_type}`,
      })),
    [contactsList],
  );

  const initialContact = useMemo(
    () => contacts.find((a) => a.id === initialContactId),
    [initialContactId, contacts],
  );

  const [selectedContact, setSelectedContact] = useState(
    initialContact || null,
  );

  useEffect(() => {
    if (typeof selectedContactId !== 'undefined') {
      const contact = selectedContactId
        ? contacts.find((a) => a.id === selectedContactId)
        : null;
      setSelectedContact(contact);
    }
  }, [selectedContactId, contacts, setSelectedContact]);

  const contactRenderer = useCallback(
    (contact, { handleClick }) => (
      <MenuItem
        key={contact.id}
        text={contact.display_name}
        label={contact.formatted_contact_service}
        onClick={handleClick}
      />
    ),
    [],
  );

  const onContactSelect = useCallback(
    (contact) => {
      setSelectedContact({ ...contact });
      onContactSelected && onContactSelected(contact);
    },
    [setSelectedContact, onContactSelected],
  );

  const handleInputValueRenderer = (inputValue) => {
    if (inputValue) {
      return inputValue.display_name.toString();
    }
  };

  const filterContacts = (query, contact, index, exactMatch) => {
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

  return (
    <Suggest
      items={contacts}
      noResults={<MenuItem disabled={true} text={<T id={'no_results'} />} />}
      itemRenderer={contactRenderer}
      itemPredicate={filterContacts}
      onItemSelect={onContactSelect}
      selectedItem={selectedContact}
      inputProps={{ placeholder: defaultTextSelect }}
      resetOnClose={true}
      popoverProps={{ minimal: true, boundary: 'window' }}
      inputValueRenderer={handleInputValueRenderer}
      className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
      {...suggestProps}
    />
  );
}
