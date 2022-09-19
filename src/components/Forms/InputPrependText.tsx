// @ts-nocheck
import React from 'react';

export function InputPrependText({ text, children }) {
  return (
    <div class="input-group-prepend">
      <span class="input-group-text">{text}</span>
    </div>
  );
}
