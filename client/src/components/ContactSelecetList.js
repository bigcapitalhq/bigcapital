import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { FormattedMessage as T } from 'components';
import { MenuItem, Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

export default function ContactSelecetList({
  contactsList,
  initialContactId,
  selectedContactId,
  selectedContactType,
  defaultSelectText = <T id={'select_contact'} />,
  onContactSelected,
  popoverFill = false,
  disabled = false,
  buttonProps
}) {
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

  const [selecetedContact, setSelectedContact] = useState(
    initialContact || null,
  );

  useEffect(() => {
    if (typeof selectedContactId !== 'undefined') {
      const account = selectedContactId
        ? contacts.find((a) => a.id === selectedContactId)
        : null;
      setSelectedContact(account);
    }
  }, [selectedContactId, contacts, setSelectedContact]);

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

  const onContactSelect = useCallback(
    (contact) => {
      setSelectedContact({ ...contact });
      onContactSelected && onContactSelected(contact);
    },
    [setSelectedContact, onContactSelected],
  );

  // Filter Contact List
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
    <Select
      items={contacts}
      noResults={<MenuItem disabled={true} text="No results." />}
      itemRenderer={handleContactRenderer}
      itemPredicate={filterContacts}
      filterable={true}
      disabled={disabled}
      onItemSelect={onContactSelect}
      popoverProps={{ minimal: true, usePortal: !popoverFill }}
      className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
    >
      <Button
        disabled={disabled}
        text={
          selecetedContact ? selecetedContact.display_name : defaultSelectText
        }
        {...buttonProps}
      />
    </Select>
  );
}
