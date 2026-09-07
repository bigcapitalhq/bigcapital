import { MenuItem } from '@blueprintjs/core';
import type { ItemRenderer } from '@blueprintjs/select';
import React from 'react';
import { getUniversalSearchBind } from './utils';
import type { UniversalSearchProps } from '@/components';
import { highlightText } from '@/utils';

type UniversalSearchItem = UniversalSearchProps['items'][number];

type UniversalSearchItemActions = Parameters<
  ItemRenderer<UniversalSearchItem>
>[1];

/**
 * Default univesal search item component.
 */
function UniversalSearchItemDetail(
  item: UniversalSearchItem,
  { handleClick, modifiers, query }: UniversalSearchItemActions,
) {
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      text={
        <div>
          <div>{highlightText(item.text, query)}</div>

          {item.subText && (
            <span className="bp4-text-muted">
              {highlightText(item.subText, query)}
            </span>
          )}
        </div>
      }
      label={
        item.label
          ? (highlightText(item.label, query) as unknown as string)
          : ''
      }
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
export const DashboardUniversalSearchItem = (
  props: UniversalSearchItem,
  actions: UniversalSearchItemActions,
) => {
  const itemRenderer = getUniversalSearchBind(props._type, 'itemRenderer');

  return typeof itemRenderer !== 'undefined'
    ? itemRenderer(props, actions)
    : UniversalSearchItemDetail(props, actions);
};
