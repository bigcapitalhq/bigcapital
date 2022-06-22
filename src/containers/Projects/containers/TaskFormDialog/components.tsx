import React from 'react';
import { MenuItem, Button } from '@blueprintjs/core';
import { FSelect } from 'components';

/**
 *
 * @param {*}
 * @param {*} param1
 * @returns
 */
const taskModalChargeRenderer = (item, { handleClick, modifiers, query }) => {
  return (
    <MenuItem
      label={item.label}
      key={item.name}
      onClick={handleClick}
      text={item.name}
    />
  );
};

const taskModalChargeSelectProps = {
  itemRenderer: taskModalChargeRenderer,
  valueAccessor: 'value',
  labelAccessor: 'name',
};

/**
 *
 * @param param0
 * @returns
 */
export function TaskModalChargeSelect({ items, ...rest }) {
  return (
    <FSelect
      {...taskModalChargeSelectProps}
      {...rest}
      items={items}
      input={TaskModalChargeSelectButton}
    />
  );
}

/**
 *
 * @param param0
 * @returns
 */
function TaskModalChargeSelectButton({ label }) {
  return <Button text={label} />;
}
