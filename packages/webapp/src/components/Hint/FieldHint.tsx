// @ts-nocheck
import { Position, Tooltip } from '@blueprintjs/core';
import React from 'react';
import { Icon } from '../Icon';

import '@/style/components/Hint.scss';
import { Tooltip2Props } from '@blueprintjs/popover2';

interface HintProps {
  content?: string | React.ReactNode;
  position?: Position;
  iconSize?: number;
  tooltipProps?: Partial<Tooltip2Props>;
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
