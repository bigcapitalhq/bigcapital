import React from 'react';
import Icon from './Icon';

export default function FieldHint({ hint }) {
  return (
    <span class="hint">
      <Icon icon="info-circle" iconSize={12} />
    </span>
  );
}