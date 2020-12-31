import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { MenuItem } from '@blueprintjs/core';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import { Suggest } from '@blueprintjs/select';

import { FormattedMessage as T } from 'react-intl';

export default function ItemsSuggestField({
  items,
  initialItemId,
  selectedItemId,

  defautlSelectText = 'Select item',
  onItemSelected,

  sellable = false,
  purchasable = false,
  popoverFill = false,
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
    [initialItemId],
  );

  const [selectedItem, setSelectedItem] = useState(initialItem || null);

  const onItemSelect = useCallback(
    (item) => {
      setSelectedItem({ ...item });
      onItemSelected && onItemSelected(item);
    },
    [setSelectedItem, onItemSelected],
  );

  const itemRenderer = useCallback((item, { modifiers, handleClick }) => (
    <MenuItem
      key={item.id}
      text={item.name}
      label={item.code}
      onClick={handleClick}
    />
  ));

  useEffect(() => {
    if (typeof selectedItemId !== 'undefined') {
      const item = selectedItemId
        ? filteredItems.find((a) => a.id === selectedItemId)
        : null;
      setSelectedItem(item);
    }
  }, [selectedItemId, filteredItems, setSelectedItem]);

  const handleInputValueRenderer = (inputValue) => {
    if (inputValue) {
      return inputValue.name.toString();
    }
    return '';
  };

  // Filters items.
  const filterItemsPredicater = useCallback(
    (query, item, _index, exactMatch) => {
      const normalizedTitle = item.name.toLowerCase();
      const normalizedQuery = query.toLowerCase();

      if (exactMatch) {
        return normalizedTitle === normalizedQuery;
      } else {
        return normalizedTitle.indexOf(normalizedQuery) >= 0;
      }
    },
    [],
  );
  return (
    <Suggest
      items={filteredItems}
      noResults={<MenuItem disabled={true} text={<T id={'no_results'} />} />}
      itemRenderer={itemRenderer}
      itemPredicate={filterItemsPredicater}
      inputValueRenderer={handleInputValueRenderer}
      selectedItem={selectedItem}
      onItemSelect={onItemSelect}
      inputProps={{ placeholder: defautlSelectText }}
      resetOnClose={true}
      fill={true}
      {...suggestProps}
      popoverProps={{ minimal: true }}
      className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
    />
  );
}
