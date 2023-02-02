// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { FormatDateCell, Icon, FormattedMessage as T } from '@/components';
import { Menu, MenuItem, Intent } from '@blueprintjs/core';
import { safeCallback } from '@/utils';

/**
 * Table actions cell.
 */
export function ActionMenu({ payload: { onDelete }, row: { original } }) {
  return (
    <Menu>
      <MenuItem
        text={intl.get('sales.action.delete')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}
