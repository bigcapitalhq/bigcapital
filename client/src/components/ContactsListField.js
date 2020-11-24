import React, { useCallback, useMemo } from 'react';
import { MenuItem } from '@blueprintjs/core';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import ListSelect from 'components/ListSelect';
import { FormattedMessage as T } from 'react-intl';

export default function ContactsListField({
  contacts,
  onContactSelected,
  selectedContactId,
  selectedContactType,
  defautlSelectText = <T id={'select_contact'} />,
  popoverFill = false,
}) {
  // Contact item of select accounts field.
  const contactRenderer = useCallback(
    (item, { handleClick, modifiers, query }) => (
      <MenuItem text={item.display_name} key={item.id} onClick={handleClick} />
    ),
    [],
  );

  const onContactSelect = useCallback(
    (contact) => {
      onContactSelected && onContactSelected(contact);
    },
    [onContactSelected],
  );

  const items = useMemo(
    () =>
      contacts.map((contact) => ({
        ...contact,
        _id: `${contact.id}_${contact.contact_type}`,
      })),
    [contacts],
  );

  return (
    <ListSelect
      items={items}
      noResults={<MenuItem disabled={true} text="No results." />}
      itemRenderer={contactRenderer}
      filterable={true}
      onItemSelect={onContactSelect}
      labelProp={'display_name'}
      selectedItem={`${selectedContactId}_${selectedContactType}`}
      selectedItemProp={'_id'}
      defaultText={defautlSelectText}
      popoverProps={{ minimal: true, usePortal: !popoverFill }}
      className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
    />
  );
}
