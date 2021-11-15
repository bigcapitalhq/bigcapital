import React from 'react';
import intl from 'react-intl-universal';
import {
  Popover,
  Menu,
  Position,
  Button,
  MenuItem,
  Classes,
  NavbarGroup,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import { Icon } from '../../../../components';
import { curry } from 'lodash/fp';
import { Select } from '@blueprintjs/select';

function ItemSwitchMenuItem({ onChange }) {
  const Transaction = [
    { name: 'Invoice' },
    { name: 'Estimate' },
    { name: 'Bill' },
    { name: 'Receipt' },
  ];

  const handleSwitchMenutItem = (item) => {
    onChange && onChange(item);
  };

  const content = (
    <Menu>
      {Transaction.map((item) => (
        <MenuItem
          onClick={() => handleSwitchMenutItem(item.name)}
          text={item.name}
        />
      ))}
    </Menu>
  );

  return (
    <Popover
      content={content}
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_LEFT}
      modifiers={{
        offset: { offset: '0, 4' },
      }}
      minimal={true}
    >
      <Button
        minimal={true}
        text="Select Service"
        rightIcon={<Icon icon={'arrow-drop-down'} iconSize={24} />}
      />
    </Popover>
  );
}

export default ItemSwitchMenuItem;
