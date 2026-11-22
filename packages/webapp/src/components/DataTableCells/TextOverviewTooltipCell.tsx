// @ts-nocheck
import { Tooltip, Position } from '@blueprintjs/core';
import React from 'react';

/**
 * Text overview tooltip cell.
 * @returns {JSX.Element}
 */
export function TextOverviewTooltipCell({ cell: { value } }) {
  const SUBMENU_POPOVER_MODIFIERS = {
    flip: { options: { rootBoundary: 'viewport', padding: 20 } },
    offset: { options: { offset: [0, 10] } },
    preventOverflow: { options: { rootBoundary: 'viewport', padding: 40 } },
  };

  return (
    <Tooltip
      content={value}
      position={Position.BOTTOM_LEFT}
      rootBoundary="viewport"
      minimal={true}
      modifiers={SUBMENU_POPOVER_MODIFIERS}
      className={'table-tooltip-overview-target'}
    >
      <span>{value}</span>
    </Tooltip>
  );
}
