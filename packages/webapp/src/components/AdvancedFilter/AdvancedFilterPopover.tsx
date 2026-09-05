import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';
import React from 'react';
import { AdvancedFilterDropdown } from './AdvancedFilterDropdown';
import type { IAdvancedFilterDropdown } from './interfaces';
import type { IPopoverProps } from '@blueprintjs/core';

interface AdvancedFilterPopoverProps {
  popoverProps?: IPopoverProps;
  advancedFilterProps: IAdvancedFilterDropdown;
  children?: React.ReactNode;
}

/**
 * Advanced filter popover.
 *
 * `advancedFilterProps` is intentionally permissive to accept the
 * loosely-typed field/condition arrays (`Record<string, any>[]`, `unknown[]`)
 * that the codebase's ListProviders currently produce. It is narrowed to
 * `IAdvancedFilterDropdown` at the boundary below.
 */
export function AdvancedFilterPopover({
  popoverProps = {},
  advancedFilterProps,
  children,
}: AdvancedFilterPopoverProps) {
  return (
    <Popover
      minimal={true}
      content={<AdvancedFilterDropdown {...advancedFilterProps} />}
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_LEFT}
      modifiers={{
        offset: { offset: '0, 4' },
      }}
      {...popoverProps}
    >
      {children}
    </Popover>
  );
}
