import React from 'react';
import {
  Button,
  PopoverInteractionKind,
  MenuItem,
  Position,
} from '@blueprintjs/core';

import { Select } from '@blueprintjs/select';
import { Icon } from 'components';

function MoreVertMenutItems({ text, items, onItemSelect, buttonProps }) {
  // Menu items renderer.
  const itemsRenderer = (item, { handleClick, modifiers, query }) => (
    <MenuItem text={item.name} label={item.label} onClick={handleClick} />
  );
  const handleMenuSelect = (type) => {
    onItemSelect && onItemSelect(type);
  };

  return (
    <Select
      items={items}
      itemRenderer={itemsRenderer}
      onItemSelect={handleMenuSelect}
      popoverProps={{
        minimal: true,
        position: Position.BOTTOM_LEFT,
        interactionKind: PopoverInteractionKind.CLICK,
        modifiers: {
          offset: { offset: '0, 4' },
        },
      }}
      filterable={false}
    >
      <Button
        text={text}
        icon={<Icon icon={'more-vert'} iconSize={16} />}
        minimal={true}
        {...buttonProps}
      />
    </Select>
  );
}

export default MoreVertMenutItems;
