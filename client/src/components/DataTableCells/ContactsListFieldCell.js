import React, { useCallback, useMemo } from 'react';
import { FormGroup, Classes } from "@blueprintjs/core";
import classNames from 'classnames';
import ContactsListField from 'components/ContactsListField';

export default function ContactsListCellRenderer({
  column: { id, value },
  row: { index, original },
  cell: { value: initialValue },
  payload: { contacts, updateData, errors }
}) {
  const handleContactSelected = useCallback((contact) => {
    updateData(index, {
      contact_id: contact.id,
      contact_type: contact.contact_type,
    });
  }, [updateData, index, id]);

  const initialContact = useMemo(() => {
    return contacts.find(c => c.id === initialValue);
  }, [contacts, initialValue]);

  return (
    <FormGroup
      className={classNames(
        'form-group--select-list',
        'form-group--contacts-list',
        Classes.FILL,
      )}
    >
      <ContactsListField
        contacts={contacts}
        onContactSelected={handleContactSelected}
        initialContact={initialContact}
      />
    </FormGroup>
  )
}