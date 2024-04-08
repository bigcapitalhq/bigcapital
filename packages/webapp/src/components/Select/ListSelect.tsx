import React, { useState, useMemo, useEffect, FC } from 'react';
import { Button, MenuItem, IButtonProps } from '@blueprintjs/core';
import { Select, ItemRenderer, ItemPredicate } from '@blueprintjs/select';
import { FormattedMessage as T } from '../FormattedMessage';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';

interface Item {
  [key: string]: any;
}

interface ListSelectProps {
  buttonProps?: IButtonProps;
  defaultText?: string | JSX.Element;
  noResultsText?: string | JSX.Element;
  isLoading?: boolean;
  textProp: string;
  labelProp: string;

  selectedItem?: string | number;
  selectedItemProp?: string;

  initialSelectedItem?: string | number;
  onItemSelect?: (item: Item) => void;
  disabled?: boolean;
  items: Item[];
  className?: string;
}

export const ListSelect: FC<ListSelectProps> = ({
  buttonProps,
  defaultText,
  noResultsText = <T id="no_results" />,
  isLoading = false,
  textProp,
  labelProp,

  selectedItem,
  selectedItemProp = 'id',

  initialSelectedItem,
  onItemSelect,
  disabled = false,
  items,
  className,
}) => {
  const selectedItemObj = useMemo(
    () => items.find((i) => i[selectedItemProp] === selectedItem),
    [items, selectedItemProp, selectedItem],
  );

  const selectedInitialItem = useMemo(
    () => items.find((i) => i[selectedItemProp] === initialSelectedItem),
    [items, selectedItemProp, initialSelectedItem],
  );

  const [currentItem, setCurrentItem] = useState<Item | null>((initialSelectedItem && selectedInitialItem) || null);

  useEffect(() => {
    if (selectedItemObj) {
      setCurrentItem(selectedItemObj);
    }
  }, [selectedItemObj]);

  const noResults: JSX.Element = isLoading ? <MenuItem text="loading" disabled={true} /> : <MenuItem disabled={true} text={noResultsText} />;

  const itemRenderer: ItemRenderer<Item> = (item, { handleClick, modifiers, query }) => {
    return (
      <MenuItem
        text={item[textProp]}
        key={item[selectedItemProp]}
        label={item[labelProp]}
        onClick={handleClick}
      />
    );
  };

  const handleItemSelect = (item: Item) => {
    setCurrentItem(item);
    onItemSelect?.(item);
  };

  const filterItems: ItemPredicate<Item> = (query, item, _index, exactMatch) => {
    const normalizedTitle = item[textProp].toLowerCase();
    const normalizedQuery = query.toLowerCase();

    return exactMatch ? normalizedTitle === normalizedQuery : normalizedTitle.includes(normalizedQuery);
  };

  return (
    <Select<Item>
      itemRenderer={itemRenderer}
      onItemSelect={handleItemSelect}
      itemPredicate={filterItems}
      items={items}
      noResults={noResults}
      disabled={disabled}
      className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, className)}
    >
      <Button
        text={currentItem ? currentItem[textProp] : defaultText}
        loading={isLoading}
        disabled={disabled}
        {...buttonProps}
        fill={true}
      />
    </Select>
  );
};
