import { Tooltip } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styles from './ItemStockTooltip.module.scss';
import type { Item } from '@bigcapital/sdk-ts';

/**
 * Parses the given stock value to a number, or `null` when it's blank.
 * Decimal columns (the reorder point) are sent by the API as strings.
 */
const toStockNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const number = Number(value);

  return Number.isNaN(number) ? null : number;
};

const quantityFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 3,
});

type ItemStock = Pick<Item, 'type' | 'quantityOnHand' | 'reorderPoint'>;

interface ItemStockTooltipProps {
  /* The item of the entry line. */
  item?: ItemStock | null;
  /* Controls whether the tooltip is open. */
  isOpen: boolean;
  /* The tooltip target. */
  children: React.ReactElement;
}

/**
 * Shows the quantity on hand and the reorder point of an inventory item in a
 * tooltip above the given target. Non-inventory items have no stock, so the
 * tooltip is disabled for them.
 */
export function ItemStockTooltip({
  item,
  isOpen,
  children,
}: ItemStockTooltipProps) {
  const quantityOnHand = toStockNumber(item?.quantityOnHand) ?? 0;
  const reorderPoint = toStockNumber(item?.reorderPoint);

  const content = (
    <dl className={styles.stock} data-testId={'item-stock-tooltip'}>
      <dt>{intl.get('qty_on_hand')}:</dt>
      <dd>{quantityFormatter.format(quantityOnHand)}</dd>

      {reorderPoint !== null && (
        <>
          <dt>{intl.get('reorder_point')}:</dt>
          <dd>{quantityFormatter.format(reorderPoint)}</dd>
        </>
      )}
    </dl>
  );

  return (
    <Tooltip
      content={content}
      isOpen={isOpen}
      disabled={item?.type !== 'inventory'}
      placement={'top'}
      fill={true}
    >
      {children}
    </Tooltip>
  );
}
