//@ts-ignore
//@ts-nocheck
import React from 'react';
import { MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@/components';

export function AccountsMultiSelect({ ...multiSelectProps }) {
  return (
    <MultiSelect
      itemRenderer={(
        item,
        { active, selected, handleClick, modifiers, query },
      ) => {
        return (
          <MenuItem
            active={active}
            icon={selected ? 'tick' : 'blank'}
            text={item.name}
            label={item.code}
            key={item.id}
            onClick={handleClick}
          />
        );
      }}
      popoverProps={{ minimal: true }}
      fill={true}
      tagRenderer={(item) => item.name}
      resetOnSelect={true}
      {...multiSelectProps}
    />
  );
}
