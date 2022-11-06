// @ts-nocheck
import React from 'react';
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';
import { AdvancedFilterDropdown } from './AdvancedFilterDropdown';

/**
 * Advanced filter popover.
 */
export function AdvancedFilterPopover({
  popoverProps,
  advancedFilterProps,
  children,
}) {
  return (
    <Popover
      minimal={true}
      content={
        <AdvancedFilterDropdown
          {...advancedFilterProps}
        />
      }
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_LEFT}
      canOutsideClickClose={true}
      modifiers={{
        offset: { offset: '0, 4' },
      }}
      {...popoverProps}
    >
      {children}
    </Popover>
  );
}
