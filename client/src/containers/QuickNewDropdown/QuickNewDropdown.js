import React from 'react';
import { Button, MenuItem } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Icon } from 'components';
import { Position } from '@blueprintjs/core';
import quickNewOptions from 'common/quickNewOptions';
import { Select } from '@blueprintjs/select';

/**
 * Quick New Dropdown.
 */
function QuickNewDropdown() {
  const history = useHistory();

  const handleClickQuickNew = ({ path }) => {
    history.push(`/${path}`);
  };

  const itemRenderer = (item, { handleClick, modifiers, query }) => (
    <MenuItem text={item.name} label={item.label} onClick={handleClick} />
  );

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

export default QuickNewDropdown;
