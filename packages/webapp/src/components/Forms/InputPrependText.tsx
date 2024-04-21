// @ts-nocheck
import React from 'react';

export function InputPrependText({ text, children }) {
  return (
    <div className="input-group-prepend">
      <span className="input-group-text">{text}</span>
    </div>
  );
}
