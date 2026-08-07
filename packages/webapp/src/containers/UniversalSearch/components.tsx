// @ts-nocheck
import { MenuItem } from '@blueprintjs/core';
import React from 'react';
import { getUniversalSearchBind } from './utils';
import { highlightText } from '@/utils';

/**
 * Default univesal search item component.
 */
function UniversalSearchItemDetail(item, { handleClick, modifiers, query }) {
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      text={
        <div>
          <div>{highlightText(item.text, query)}</div>

          {item.subText && (
            <span class="bp4-text-muted">
              {highlightText(item.subText, query)}
            </span>
          )}
        </div>
      }
      label={item.label ? highlightText(item.label, query) : ''}
      onClick={handleClick}
    />
  );
}

/**
 *
 * @param {*} props
 * @param {*} actions
 * @returns
 */
export const DashboardUniversalSearchItem = (props, actions) => {
  const itemRenderer = getUniversalSearchBind(props._type, 'itemRenderer');

  return typeof itemRenderer !== 'undefined'
    ? itemRenderer(props, actions)
    : UniversalSearchItemDetail(props, actions);
};
