import { MenuItem } from '@blueprintjs/core';
import React from 'react';
import { getUniversalSearchBind } from './utils';
import type { UniversalSearchItem } from '@/components/UniversalSearch/UniversalSearch';
import type { ItemRendererProps, ItemRenderer } from '@blueprintjs/select';
import { highlightText } from '@/utils';
import { NS } from '@/constants/classes';

/**
 * Default univesal search item component.
 */
function UniversalSearchItemDetail(
  item: UniversalSearchItem,
  { handleClick, modifiers, query }: ItemRendererProps,
) {
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      text={
        <div>
          <div>{highlightText(item.text, query)}</div>

          {item.subText && (
            <span className={`${NS}-text-muted`}>
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
 * Dashboard universal search item.
 */
export const DashboardUniversalSearchItem: ItemRenderer<UniversalSearchItem> = (
  props,
  actions,
) => {
  const itemRenderer = getUniversalSearchBind(props._type, 'itemRenderer');

  return typeof itemRenderer !== 'undefined'
    ? itemRenderer(props, actions)
    : UniversalSearchItemDetail(props, actions);
};
