// @ts-nocheck
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import classNames from 'classnames';
import * as R from 'ramda';
import intl from 'react-intl-universal';
import { CLASSES } from '@/constants/classes';

import { FormattedMessage as T } from '@/components';

import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { DRAWERS } from '@/constants/drawers';

// Creates a new item from query.
const createNewItemFromQuery = (name) => {
  return {
    name,
  };
};

// Handle quick create new customer.
const createNewItemRenderer = (query, active, handleClick) => {
  return (
    <MenuItem
      icon="add"
      text={intl.get('list.create', { value: `"${query}"` })}
      active={active}
      shouldDismissPopover={false}
      onClick={handleClick}
    />
  );
};

// Item renderer.
const itemRenderer = (item, { modifiers, handleClick }) => (
  <MenuItem
    key={item.id}
    text={item.name}
    label={item.code}
    onClick={handleClick}
  />
);

// Filters items.
const filterItemsPredicater = (query, item, _index, exactMatch) => {
  const normalizedTitle = item.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${normalizedTitle} ${item.code}`.indexOf(normalizedQuery) >= 0;
  }
};

// Handle input value renderer.
const handleInputValueRenderer = (inputValue) => {
  if (inputValue) {
    return inputValue.name.toString();
  }
  return '';
};

function ItemsSuggestFieldRoot({
  items,
  initialItemId,
  selectedItemId,

  defaultSelectText = 'Select item',
  onItemSelected,

  sellable = false,
  purchasable = false,
  popoverFill = false,

  allowCreate = true,

  openDrawer,
  ...suggestProps
}) {
  // Filters items based on filter props.
  const filteredItems = useMemo(() => {
    let filteredItems = [...items];

    if (sellable) {
      filteredItems = filteredItems.filter((item) => item.sellable);
    }
    if (purchasable) {
      filteredItems = filteredItems.filter((item) => item.purchasable);
    }
    return filteredItems;
  }, [items, sellable, purchasable]);

  // Find initial item object.
  const initialItem = useMemo(
    () => filteredItems.some((a) => a.id === initialItemId),
    [initialItemId, filteredItems],
  );

  const [selectedItem, setSelectedItem] = useState(initialItem || null);

  const onItemSelect = useCallback(
    (item) => {
      if (item.id) {
        setSelectedItem({ ...item });
        onItemSelected && onItemSelected(item);
      } else {
        openDrawer(DRAWERS.QUICK_CREATE_ITEM);
      }
    },
    [setSelectedItem, onItemSelected, openDrawer],
  );

  useEffect(() => {
    if (typeof selectedItemId !== 'undefined') {
      const item = selectedItemId
        ? filteredItems.find((a) => a.id === selectedItemId)
        : null;
      setSelectedItem(item);
    }
  }, [selectedItemId, filteredItems, setSelectedItem]);

  // Maybe inject create new item props to suggest component.
  const maybeCreateNewItemRenderer = allowCreate ? createNewItemRenderer : null;
  const maybeCreateNewItemFromQuery = allowCreate
    ? createNewItemFromQuery
    : null;

  return (
    <Suggest
      items={filteredItems}
      noResults={<MenuItem disabled={true} text={<T id={'no_results'} />} />}
      itemRenderer={itemRenderer}
      itemPredicate={filterItemsPredicater}
      inputValueRenderer={handleInputValueRenderer}
      selectedItem={selectedItem}
      onItemSelect={onItemSelect}
      inputProps={{ placeholder: defaultSelectText }}
      resetOnClose={true}
      fill={true}
      popoverProps={{ minimal: true, boundary: 'window' }}
      className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
      createNewItemRenderer={maybeCreateNewItemRenderer}
      createNewItemFromQuery={maybeCreateNewItemFromQuery}
      createNewItemPosition={'top'}
      {...suggestProps}
    />
  );
}

export const ItemsSuggestField =
  R.compose(withDrawerActions)(ItemsSuggestFieldRoot);
