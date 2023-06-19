// @ts-nocheck
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';

import { MenuItem, Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';

export function ContactSelectList({
  contactsList,
  initialContactId,
  selectedContactId,
  createNewItemFrom,
  defaultSelectText = <T id={'select_contact'} />,
  onContactSelected,
  popoverFill = false,
  disabled = false,
  buttonProps,

  ...restProps
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

  const [selectedContact, setSelectedContact] = useState(
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
  const itemPredicate = (query, contact, index, exactMatch) => {
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
      noResults={<MenuItem disabled={true} text={<T id={'no_results'} />} />}
      itemRenderer={handleContactRenderer}
      itemPredicate={itemPredicate}
      filterable={true}
      disabled={disabled}
      onItemSelect={onContactSelect}
      popoverProps={{ minimal: true, usePortal: !popoverFill }}
      className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
      inputProps={{
        placeholder: intl.get('filter_'),
      }}
      {...restProps}
    >
      <Button
        disabled={disabled}
        text={
          selectedContact ? selectedContact.display_name : defaultSelectText
        }
        {...buttonProps}
      />
    </Select>
  );
}
