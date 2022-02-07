import React from 'react';
import {
  Button,
  MenuItem,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { defaultTo } from 'lodash';
import { Select } from '@blueprintjs/select';
import { FormattedMessage as T, Icon } from 'components';

/**
 *  warehouse & branches select list.
 * @returns
 */
export default function CustomSelectList({
  // #ownProps
  items,
  initialItemId,
  selectedItemId,
  text,
  onItemSelected,
  buttonProps,
}) {
  const initialItem = React.useMemo(
    () => items.find((a) => a.id === initialItemId),
    [initialItemId, items],
  );

  const [selecetedItem, setSelectedItem] = React.useState(initialItem || null);

  React.useEffect(() => {
    if (typeof selectedItemId !== 'undefined') {
      const item = selectedItemId
        ? items.find((a) => a.id === selectedItemId)
        : null;
      setSelectedItem(item);
    }
  }, [selectedItemId, items, setSelectedItem]);

  // Menu items renderer.
  const itemRenderer = (item, { handleClick, modifiers, query }) => (
    <MenuItem
      text={item.name}
      key={item.id}
      label={item.code}
      onClick={handleClick}
    />
  );

  // Filters items items.
  const filterItemsPredicater = (query, item, _index, exactMatch) => {
    const normalizedTitle = item.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return `${item.code} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
    }
  };

  const handleItemMenuSelect = React.useCallback(
    (item) => {
      if (item.id) {
        setSelectedItem({ ...item });
        onItemSelected && onItemSelected(item);
      }
    },
    [onItemSelected, setSelectedItem],
  );

  return (
    <Select
      items={items}
      noResults={<MenuItem disabled={true} text={<T id={'no_accounts'} />} />}
      itemRenderer={itemRenderer}
      itemPredicate={filterItemsPredicater}
      onItemSelect={handleItemMenuSelect}
      popoverProps={{
        minimal: true,
        position: Position.BOTTOM_LEFT,
        interactionKind: PopoverInteractionKind.CLICK,
        modifiers: {
          offset: { offset: '0, 4' },
        },
      }}
    >
      <Button
        text={
          selecetedItem
            ? `${text}:${selecetedItem.name} ${defaultTo(
                selecetedItem.code,
                '',
              )}`
            : `${text}: Bigcapital`
        }
        minimal={true}
        {...buttonProps}
      />
    </Select>
  );
}
