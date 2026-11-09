import { MenuItem } from '@blueprintjs/core';
import React from 'react';
import { getUniversalSearchBind } from './utils';
import type { UniversalSearchItem } from '@/components/UniversalSearch/UniversalSearch';
import type { IItemRendererProps, ItemRenderer } from '@blueprintjs/select';
import { highlightText } from '@/utils';

/**
 * Default univesal search item component.
 */
function UniversalSearchItemDetail(
  item: UniversalSearchItem,
  { handleClick, modifiers, query }: IItemRendererProps,
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
