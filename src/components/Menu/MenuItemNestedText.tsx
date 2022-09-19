// @ts-nocheck
import React from 'react';

/**
 * Menu item nested text.
 */
export function MenuItemNestedText({ level, text }) {
  const whitespaces = [...Array(level - 1)].map((e, i) => (
    <span key={i} className={'menu-item-space'}></span>
  ));

  return (
    <>
      {whitespaces} {text}
    </>
  );
}
