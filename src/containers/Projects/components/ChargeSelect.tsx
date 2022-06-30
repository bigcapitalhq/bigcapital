import React from 'react';
import { MenuItem, Button } from '@blueprintjs/core';
import { FSelect } from 'components';

/**
 *
 * @param {*}
 * @param {*} param1
 * @returns
 */
const chargeItemRenderer = (item, { handleClick, modifiers, query }) => {
  return (
    <MenuItem
      label={item.label}
      key={item.name}
      onClick={handleClick}
      text={item.name}
    />
  );
};

const chargeItemSelectProps = {
  itemRenderer: chargeItemRenderer,
  valueAccessor: 'value',
  labelAccessor: 'name',
};

/**
 *
 * @param param0
 * @returns
 */
export function ChargeSelect({ items, ...rest }) {
  return (
    <FSelect
      {...chargeItemSelectProps}
      {...rest}
      items={items}
      input={ChargeSelectButton}
    />
  );
}
/**
 *
 * @param param0
 * @returns
 */
function ChargeSelectButton({ label }) {
  return <Button text={label} />;
}
