import { Button, ButtonGroup } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import styled from 'styled-components';

export interface SegmentedControlItem<T extends string = string> {
  label: React.ReactNode;
  value: T;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  items: SegmentedControlItem<T>[];
  value: T;
  onChange: (value: T) => void;
  small?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Segmented control.
 * A BlueprintJS v4 based segmented control with the same API shape as the
 * BlueprintJS v5 `SegmentedControl` so it can be swapped with the official
 * component once the library is upgraded.
 */
export function SegmentedControl<T extends string = string>({
  items,
  value,
  onChange,
  small = true,
  disabled,
  className,
}: SegmentedControlProps<T>) {
  return (
    <SegmentedControlGroup
      className={clsx('segmented-control', className)}
      fill={false}
    >
      {items.map((item) => (
        <Button
          key={item.value}
          type="button"
          outlined
          small={small}
          active={item.value === value}
          disabled={disabled || item.disabled}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </Button>
      ))}
    </SegmentedControlGroup>
  );
}

const SegmentedControlGroup = styled(ButtonGroup)`
  --segmented-control-active-background: var(--color-dark-gray2);
  --segmented-control-active-hover-background: var(--color-dark-gray1);

  .bp4-dark & {
    --segmented-control-active-background: var(--color-dark-gray5);
    --segmented-control-active-hover-background: var(--color-dark-gray4);
  }

  && .bp4-button {
    font-weight: 500;

    & + .bp4-button {
      margin-left: -1px;
    }
    &.bp4-active:not(.bp4-disabled) {
      z-index: 1;
      color: var(--color-white);
      background-color: var(--segmented-control-active-background);
      border-color: var(--segmented-control-active-background);

      &:hover {
        background-color: var(--segmented-control-active-hover-background);
        border-color: var(--segmented-control-active-hover-background);
      }
    }
  }
`;
