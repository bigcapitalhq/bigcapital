import React, { useMemo, useCallback, useState } from 'react';
import { MenuItem, Button } from '@blueprintjs/core';
import { omit } from 'lodash';
import MultiSelect from 'components/MultiSelect';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';

export default function ContactsMultiSelect({
  contacts,
  defaultText = <T id={'all_customers'} />,
  buttonProps,

  onCustomerSelected: onContactSelected,
  ...selectProps
}) {
  const [selectedContacts, setSelectedContacts] = useState({});

  const isContactSelect = useCallback(
    (id) => typeof selectedContacts[id] !== 'undefined',
    [selectedContacts],
  );

  const contactRenderer = useCallback(
    (contact, { handleClick }) => (
      <MenuItem
        icon={isContactSelect(contact.id) ? 'tick' : 'blank'}
        text={contact.display_name}
        key={contact.id}
        onClick={handleClick}
      />
    ),
    [isContactSelect],
  );

  const countSelected = useMemo(
    () => Object.values(selectedContacts).length,
    [selectedContacts],
  );

  const onContactSelect = useCallback(
    ({ id }) => {
      const selected = {
        ...(isContactSelect(id)
          ? {
              ...omit(selectedContacts, [id]),
            }
          : {
              ...selectedContacts,
              [id]: true,
            }),
      };
      setSelectedContacts({ ...selected });
      onContactSelected && onContactSelected(selected);
    },
    [setSelectedContacts, selectedContacts, isContactSelect, onContactSelected],
  );

  return (
    <MultiSelect
      items={contacts}
      noResults={<MenuItem disabled={true} text="No results." />}
      itemRenderer={contactRenderer}
      popoverProps={{ minimal: true }}
      filterable={true}
      onItemSelect={onContactSelect}
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
