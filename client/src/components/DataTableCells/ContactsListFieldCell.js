import React, { useState, useCallback, useMemo } from 'react';
import { FormGroup, Intent, Classes } from "@blueprintjs/core";
import classNames from 'classnames';
import ContactsListField from 'components/ContactsListField';

export default function ContactsListCellRenderer({
  column: { id },
  row: { index, original },
  cell: { value },
  payload: { contacts, updateData, errors }
}) {
  const handleContactSelected = useCallback((contact) => {
    updateData(index, {
      contact_id: contact.id,
      contact_type: contact.contact_type,
    });
  }, [updateData, index, id]);

  const error = errors?.[index]?.[id];

  return (
    <FormGroup
      intent={error ? Intent.DANGER : null}
      className={classNames(
        'form-group--select-list',
        'form-group--contacts-list',
        Classes.FILL,
      )}
    >
      <ContactsListField
        contacts={contacts}
        onContactSelected={handleContactSelected} 
        selectedContactId={original?.contact_id}
        selectedContactType={original?.contact_type}
      />
    </FormGroup>
  );
}