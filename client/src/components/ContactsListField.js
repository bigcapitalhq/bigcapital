import React, { useCallback, useState } from 'react';
import {
  MenuItem,
  Button,
} from '@blueprintjs/core';
import ListSelect from 'components/ListSelect';
import { FormattedMessage as T } from 'react-intl';

export default function ContactsListField({
  contacts,
  onContactSelected,
  error,
  initialContact,
  defautlSelectText = (<T id={'select_contact'} />)
}) {
  const [selectedContact, setSelectedContact] = useState(
    initialContact || null
  );

  // Contact item of select accounts field.
  const contactItem = useCallback((item, { handleClick, modifiers, query }) => (
    <MenuItem text={item.display_name} key={item.id} onClick={handleClick} />
  ), []);

  const onContactSelect = useCallback((contact) => {
    setSelectedContact(contact.id);
    onContactSelected && onContactSelected(contact);
  }, [setSelectedContact, onContactSelected]);

  return (
    <ListSelect
      items={contacts}
      noResults={<MenuItem disabled={true} text='No results.' />}
      itemRenderer={contactItem}
      popoverProps={{ minimal: true }}
      filterable={true}
      onItemSelect={onContactSelect}
      labelProp={'display_name'}
      selectedItem={selectedContact}
      selectedItemProp={'id'} 
      defaultText={defautlSelectText} />
  );
}