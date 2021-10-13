import React from 'react';
import classNames from 'classnames';

import {
  Button,
  PopoverInteractionKind,
  MenuItem,
  Classes,
  Position,
} from '@blueprintjs/core';

import { Select } from '@blueprintjs/select';
import { Icon } from 'components';

export const CashFlowMenuItems = ({ text, items, onItemSelect }) => {
  // Menu items renderer.
  const itemsRenderer = (item, { handleClick, modifiers, query }) => (
    <MenuItem text={item.name} label={item.label} onClick={handleClick} />
  );

  const handleCashFlowMenuSelect = (type) => {
    onItemSelect && onItemSelect(type);
  };

  return (
    <Select
      items={items}
      itemRenderer={itemsRenderer}
      onItemSelect={handleCashFlowMenuSelect}
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
        icon={<Icon icon={'plus-24'} iconSize={20} />}
        // rightIcon={'caret-down'}
        // className={classNames(Classes.MINIMAL, 'button--table-views')}
        minimal={true}
      />
    </Select>
  );
};
