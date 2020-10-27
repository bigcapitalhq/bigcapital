import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { MenuItem } from '@blueprintjs/core';
import ListSelect from 'components/ListSelect';

function ItemsListField({
  items,
  initialItemId,
  selectedItemId,
  defautlSelectText = 'Click to select an item.',
  onItemSelected,
}) {
  const initialItem = useMemo(() => items.find((a) => a.id === initialItemId), [
    initialItemId,
  ]);

  const [selectedItem, setSelectedItem] = useState(initialItem || null);

  useEffect(() => {
    if (typeof selectedItemId !== 'undefined') {
      const item = selectedItemId
        ? items.find((a) => a.id === selectedItemId)
        : null;
      setSelectedItem(item);
    }
  }, [selectedItemId, items, setSelectedItem]);

  const onItemSelect = useCallback(
    (item) => {
      setSelectedItem({ ...item });
      onItemSelected && onItemSelected(item);
    },
    [onItemSelected],
  );

  const itemRenderer = useCallback(
    (item, { handleClick }) => (
      <MenuItem key={item.id} text={item.name} onClick={handleClick} />
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
      items={items}
      noResults={<MenuItem disabled={true} text="No results." />}
      itemRenderer={itemRenderer}
      itemPredicate={filterItem}
      popoverProps={{ minimal: true }}
      onItemSelect={onItemSelect}
      selectedItem={`${selectedItemId}`}
      selectedItemProp={'id'}
      labelProp={'name'}
      defaultText={selectedItem ? selectedItem.name : defautlSelectText}
    />
  );
}

export default ItemsListField;
