// @ts-nocheck
import React from 'react';
import { Tooltip, Position } from '@blueprintjs/core';

/**
 * Text overview tooltip cell.
 * @returns {JSX.Element}
 */
export function TextOverviewTooltipCell({ cell: { value } }) {
  const SUBMENU_POPOVER_MODIFIERS = {
    flip: { boundariesElement: 'viewport', padding: 20 },
    offset: { offset: '0, 10' },
    preventOverflow: { boundariesElement: 'viewport', padding: 40 },
  };

  return (
    <Tooltip
      content={value}
      position={Position.BOTTOM_LEFT}
      boundary={'viewport'}
      minimal={true}
      modifiers={SUBMENU_POPOVER_MODIFIERS}
      targetClassName={'table-tooltip-overview-target'}
    >
      {value}
    </Tooltip>
  );
}
