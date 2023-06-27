// @ts-nocheck
import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { ListSelect, T } from '@/components';

export function ItemsListField({
  items,
  initialItemId,
  selectedItemId,
  defaultSelectText = 'Click to select an item.',
  onItemSelected,

  sellable = false,
  purchasable = false,
}) {
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

  const initialItem = useMemo(
    () => filteredItems.find((a) => a.id === initialItemId),
    [initialItemId],
  );

  const [selectedItem, setSelectedItem] = useState(initialItem || null);

  useEffect(() => {
    if (typeof selectedItemId !== 'undefined') {
      const item = selectedItemId
        ? filteredItems.find((a) => a.id === selectedItemId)
        : null;
      setSelectedItem(item);
    }
  }, [selectedItemId, filteredItems, setSelectedItem]);

  const onItemSelect = useCallback(
    (item) => {
      setSelectedItem({ ...item });
      onItemSelected && onItemSelected(item);
    },
    [onItemSelected],
  );

  const itemRenderer = useCallback(
    (item, { handleClick }) => (
      <MenuItem
        key={item.id}
        text={item.name}
        label={item.code}
        onClick={handleClick}
      />
    ),
    [],
  );

  const filterItem = useCallback((query, item, _index, exactMatch) => {
    const normalizedTitle = item.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  }, []);

  return (
    <ListSelect
      items={filteredItems}
      noResults={<MenuItem disabled={true} text={<T id={'no_results'} />} />}
      itemRenderer={itemRenderer}
      itemPredicate={filterItem}
      popoverProps={{ minimal: true }}
      onItemSelect={onItemSelect}
      selectedItem={`${selectedItemId}`}
      selectedItemProp={'id'}
      textProp={'name'}
      defaultText={selectedItem ? selectedItem.name : defaultSelectText}
    />
  );
}
