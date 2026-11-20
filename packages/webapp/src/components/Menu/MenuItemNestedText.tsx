// @ts-nocheck
import React from 'react';

/**
 * Menu item nested text.
 */
export function MenuItemNestedText({ level, text }) {
  const safeLevel = Math.max(1, Math.floor(Number(level) || 1));
  const whitespaces = [...Array(safeLevel - 1)].map((e, i) => (
    <span key={i} className={'menu-item-space'}></span>
  ));

  return (
    <>
      {whitespaces} {text}
    </>
  );
}
