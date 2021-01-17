import React from 'react';
import { Tooltip } from '@blueprintjs/core';
import Icon from './Icon';

import 'style/components/Hint.scss';

/**
 * Field hint.
 */
export default function FieldHint({
  content,
  position,
  iconSize = 12
}) {
  return (
    <span class="hint">
      <Tooltip content={content} position={position}>
        <Icon icon="info-circle" iconSize={iconSize} />
      </Tooltip>
    </span>
  );
}