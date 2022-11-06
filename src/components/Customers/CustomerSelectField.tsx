// @ts-nocheck
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import * as R from 'ramda';

import { MenuItem, Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';

import {
  itemPredicate,
  handleContactRenderer,
  createNewItemRenderer,
  createNewItemFromQuery,
} from './utils';

import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { DRAWERS } from '@/constants/drawers';

function CustomerSelectFieldRoot({
  // #withDrawerActions
  openDrawer,

  // #ownProps
  contacts,
  initialContactId,
  selectedContactId,
  defaultSelectText = <T id={'select_contact'} />,
  onContactSelected,
  popoverFill = false,
  disabled = false,
  allowCreate,
  buttonProps,

  ...restProps
}) {
  const localContacts = useMemo(
    () =>
      contacts.map((contact) => ({
        ...contact,
        _id: `${contact.id}_${contact.contact_type}`,
      })),
    [contacts],
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

  const handleContactSelect = useCallback(
    (contact) => {
      if (contact.id) {
        setSelectedContact({ ...contact });
        onContactSelected && onContactSelected(contact);
      } else {
        openDrawer(DRAWERS.QUICK_CREATE_CUSTOMER);
      }
    },
    [setSelectedContact, onContactSelected, openDrawer],
  );

  // Maybe inject create new item props to suggest component.
  const maybeCreateNewItemRenderer = allowCreate ? createNewItemRenderer : null;
  const maybeCreateNewItemFromQuery = allowCreate
    ? createNewItemFromQuery
    : null;

  return (
    <Select
      items={localContacts}
      noResults={<MenuItem disabled={true} text={<T id={'no_results'} />} />}
      itemRenderer={handleContactRenderer}
      itemPredicate={itemPredicate}
      filterable={true}
      disabled={disabled}
      onItemSelect={handleContactSelect}
      popoverProps={{ minimal: true, usePortal: !popoverFill }}
      className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
      inputProps={{
        placeholder: intl.get('filter_'),
      }}
      createNewItemRenderer={maybeCreateNewItemRenderer}
      createNewItemFromQuery={maybeCreateNewItemFromQuery}
      createNewItemPosition={'top'}
      {...restProps}
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

export const CustomerSelectField = R.compose(withDrawerActions)(
  CustomerSelectFieldRoot,
);
