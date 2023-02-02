// @ts-nocheck
import React, { useCallback } from 'react';
import { FormGroup, Intent, Classes } from '@blueprintjs/core';
import classNames from 'classnames';

import { CellType } from '@/constants';
import { ContactsSuggestField } from '@/components';
export default function ContactsListCellRenderer({
  column: { id },
  row: { index, original },
  cell: { value },
  payload: { contacts, updateData, errors },
}) {
  const handleContactSelected = useCallback(
    (contact) => {
      updateData(index, 'contact_id', contact.id);
    },
    [updateData, index, id],
  );

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
      <ContactsSuggestField
        contactsList={contacts}
        onContactSelected={handleContactSelected}
        selectedContactId={original?.contact_id}
        selectedContactType={original?.contact_type}
      />
    </FormGroup>
  );
}

ContactsListCellRenderer.cellType = CellType.Field;
