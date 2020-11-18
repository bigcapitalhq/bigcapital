import React from 'react';
import { Tooltip, Position } from '@blueprintjs/core';
import Icon from './Icon';

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