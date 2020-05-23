import React, { useState, useEffect } from 'react';
import {
  Button,
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

export default function ListSelect ({
  buttonProps,
  defaultText,
  labelProp,

  selectedItem,
  selectedItemProp = 'id',
  ...selectProps
}) {
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (selectedItem && selectedItemProp) {
      const item = selectProps.items.find(i => i[selectedItemProp] === selectedItem);
      setCurrentItem(item);
    }
  }, [selectedItem, selectedItemProp, selectProps.items]);

  return (
    <Select
      {...selectProps}
    >
      <Button
        text={currentItem ? currentItem[labelProp] : defaultText}
        {...buttonProps}
      />
    </Select>
  )
}