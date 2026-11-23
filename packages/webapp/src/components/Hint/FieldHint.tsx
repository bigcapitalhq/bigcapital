// @ts-nocheck
import { Position, Tooltip, TooltipProps } from '@blueprintjs/core';
import React from 'react';
import { Icon } from '../Icon';
import '@/style/components/Hint.scss';

interface HintProps {
  content?: string | React.ReactNode;
  position?: Position;
  iconSize?: number;
  tooltipProps?: Partial<TooltipProps>;
}

/**
 * Field hint.
 */
export function FieldHint({
  content,
  position,
  iconSize = 12,
  tooltipProps,
}: HintProps) {
  return (
    <span class="hint">
      <Tooltip content={content} position={position} {...tooltipProps}>
        <Icon icon="info-circle" iconSize={iconSize} />
      </Tooltip>
    </span>
  );
}

export const Hint = FieldHint;
