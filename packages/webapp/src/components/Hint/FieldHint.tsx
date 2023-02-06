// @ts-nocheck
import React from 'react';
import { Tooltip } from '@blueprintjs/core';
import { Icon } from '../Icon';

import '@/style/components/Hint.scss';

/**
 * Field hint.
 */
export function FieldHint({ content, position, iconSize = 12, tooltipProps }) {
  return (
    <span class="hint">
      <Tooltip content={content} position={position} {...tooltipProps}>
        <Icon icon="info-circle" iconSize={iconSize} />
      </Tooltip>
    </span>
  );
}

export const Hint = FieldHint;
