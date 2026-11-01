import { Button, MenuItem } from '@blueprintjs/core';
import { Position } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import React from 'react';
import { useHistory } from 'react-router-dom';
import type { QuickNewActionOption } from '@/constants/types';
import type { ItemRendererProps } from '@blueprintjs/select';
import { FormattedMessage as T } from '@/components';
import { Icon } from '@/components';
import { useGetQuickNewMenu } from '@/constants/quickNewOptions';

/**
 * Menu item shape consumed by the renderer below. `label` is not provided by
 * `QuickNewActionOption`; it is kept optional here to preserve the original
 * rendering behavior (label is always `undefined` at runtime).
 */
interface QuickNewMenuItem extends QuickNewActionOption {
  label?: string;
}

/**
 * Quick New Dropdown.
 */
export function QuickNewDropdown() {
  const history = useHistory();
  const quickNewOptions = useGetQuickNewMenu();

  // Can't continue if there is no any quick new menu items to display.
  if (quickNewOptions.length === 0) {
    return null;
  }
  // Handle click quick new button.
  const handleClickQuickNew = ({ path }: QuickNewActionOption) => {
    history.push(`/${path}`);
  };

  // Item renderer.
  const itemRenderer = (
    item: QuickNewMenuItem,
    { handleClick, modifiers, query }: ItemRendererProps,
  ) => <MenuItem text={item.name} label={item.label} onClick={handleClick} />;

  return (
    <Select
      items={quickNewOptions}
      itemRenderer={itemRenderer}
      onItemSelect={(type) => handleClickQuickNew(type)}
      popoverProps={{ minimal: false, position: Position.BOTTOM }}
      className={'form-group--quick-new-downDrop'}
      filterable={false}
    >
      <Button
        text={<T id={'quick_new'} />}
        icon={<Icon icon={'plus-24'} iconSize={20} />}
        minimal={true}
      />
    </Select>
  );
}
