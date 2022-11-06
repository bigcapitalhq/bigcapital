// @ts-nocheck
import React from 'react';

export function Join({ items, sep }) {
  return items.length > 0
    ? items.reduce((result, item) => (
        <>
          {result}
          {sep}
          {item}
        </>
      ))
    : null;
}
