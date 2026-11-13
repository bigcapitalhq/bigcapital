import { Button, Intent, NumericInput, Tag } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import React from 'react';
import intl from 'react-intl-universal';
import type { Batch } from '@/hooks/query/batches/queries';
import type { ItemEntryBatchAllocation } from '@/interfaces/ItemEntries';
import { FormattedMessage as T } from '@/components';
import { useItemBatches } from '@/hooks/query';

interface SaleBatchAllocationsPopoverProps {
  itemId: number;
  entryQuantity: number | string;
  allocations?: ItemEntryBatchAllocation[];
  onApply: (allocations: ItemEntryBatchAllocation[]) => void;
  disabled?: boolean;
}

interface BatchRow {
  batch: Batch;
  available: number;
}

const toNumber = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

/**
 * Builds a concise label describing the entry batch allocations.
 */
export const getBatchAllocationsLabel = (
  allocations?: ItemEntryBatchAllocation[],
) => {
  if (!allocations?.length) {
    return intl.get('batch.select.button');
  }
  if (allocations.length === 1) {
    const allocation = allocations[0];
    return `${allocation.batch?.batchNumber ?? `#${allocation.batchId}`} (${
      allocation.quantity
    })`;
  }
  return intl.get('batch.select.batches_count', {
    count: allocations.length,
  });
};

/**
 * Popover used to allocate a sale invoice line quantity across multiple
 * batches.
 */
export function SaleBatchAllocationsPopover({
  itemId,
  entryQuantity,
  allocations,
  onApply,
  disabled,
}: SaleBatchAllocationsPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [quantities, setQuantities] = React.useState<Record<number, number>>(
    {},
  );
  const { data: batchesData, isLoading } = useItemBatches(itemId, {
    enabled: isOpen && !!itemId,
  });

  const requiredQuantity = toNumber(entryQuantity);
  const allocatedByBatch = React.useMemo(() => {
    return (allocations ?? []).reduce<Record<number, number>>(
      (map, allocation) => {
        map[allocation.batchId] =
          (map[allocation.batchId] ?? 0) + toNumber(allocation.quantity);
        return map;
      },
      {},
    );
  }, [allocations]);

  React.useEffect(() => {
    if (isOpen) {
      setQuantities({ ...allocatedByBatch });
    }
    // The quantities are only initialized when the popover transitions to
    // open; subsequent parent re-renders must not reset the user's input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const rows: BatchRow[] = React.useMemo(() => {
    const batches = (batchesData?.results ?? []) as Batch[];
    return batches
      .filter(
        (batch) =>
          (batch.status === 'active' || batch.status === 'expiring_soon') &&
          (batch.quantityOnHand > 0 ||
            allocatedByBatch[batch.id] !== undefined),
      )
      .map((batch) => ({
        batch,
        available: Math.max(
          toNumber(batch.quantityOnHand) + toNumber(allocatedByBatch[batch.id]),
          0,
        ),
      }))
      .sort((a, b) => {
        if (!a.batch.expiryDate && !b.batch.expiryDate) return 0;
        if (!a.batch.expiryDate) return 1;
        if (!b.batch.expiryDate) return -1;
        return (
          new Date(a.batch.expiryDate).getTime() -
          new Date(b.batch.expiryDate).getTime()
        );
      });
  }, [batchesData, allocatedByBatch]);

  const allocatedTotal = Object.values(quantities).reduce(
    (sum, quantity) => sum + toNumber(quantity),
    0,
  );
  const hasExceededAvailable = rows.some(
    (row) => toNumber(quantities[row.batch.id]) > row.available + 0.0001,
  );
  const isBalanced = Math.abs(allocatedTotal - requiredQuantity) <= 0.0001;
  const canApply =
    rows.length > 0 &&
    allocatedTotal > 0 &&
    isBalanced &&
    !hasExceededAvailable;

  const setQuantity = (batchId: number, quantity: number) => {
    setQuantities((current) => ({
      ...current,
      [batchId]: Math.max(toNumber(quantity), 0),
    }));
  };

  const handleAutoAllocate = () => {
    let remaining = requiredQuantity;
    const next: Record<number, number> = {};

    rows.forEach((row) => {
      if (remaining <= 0) return;
      const quantity = Math.min(row.available, remaining);
      if (quantity > 0) {
        next[row.batch.id] = quantity;
        remaining -= quantity;
      }
    });
    setQuantities(next);
  };

  const handleApply = () => {
    if (!canApply) return;
    const nextAllocations = rows
      .filter((row) => toNumber(quantities[row.batch.id]) > 0)
      .map<ItemEntryBatchAllocation>((row) => ({
        batchId: row.batch.id,
        quantity: toNumber(quantities[row.batch.id]),
        batch: row.batch,
      }));
    onApply(nextAllocations);
    setIsOpen(false);
  };

  return (
    <Popover2
      isOpen={isOpen}
      onInteraction={(nextOpenState) => setIsOpen(nextOpenState)}
      placement={'bottom-start'}
      minimal={true}
      disabled={disabled}
      popoverClassName={'batch-allocations-popover'}
      content={
        <div
          className={'batch-allocations'}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={'batch-allocations__header'}>
            <strong>
              <T id={'batch.allocate.title'} />
            </strong>
            <span>
              <T id={'batch.allocate.required'} />: {requiredQuantity}
            </span>
          </div>

          {isLoading ? (
            <div className={'batch-allocations__empty'}>
              <T id={'loading'} />
            </div>
          ) : rows.length === 0 ? (
            <div className={'batch-allocations__empty'}>
              <T id={'batch.select.no_available_batches'} />
            </div>
          ) : (
            <>
              <div className={'batch-allocations__toolbar'}>
                <Button
                  small={true}
                  minimal={true}
                  onClick={handleAutoAllocate}
                >
                  <T id={'batch.allocate.auto'} />
                </Button>
                <Button
                  small={true}
                  minimal={true}
                  onClick={() => setQuantities({})}
                >
                  <T id={'batch.allocate.clear'} />
                </Button>
              </div>

              <div className={'batch-allocations__rows'}>
                {rows.map((row) => {
                  const quantity = toNumber(quantities[row.batch.id]);
                  const exceeded = quantity > row.available + 0.0001;

                  return (
                    <div
                      key={row.batch.id}
                      className={'batch-allocations__row'}
                    >
                      <div className={'batch-allocations__batch'}>
                        <div>
                          <strong>{row.batch.batchNumber}</strong>
                          {row.batch.batchRef ? (
                            <span> · {row.batch.batchRef}</span>
                          ) : null}
                        </div>
                        <div className={'batch-allocations__meta'}>
                          <span>
                            <T id={'batch.select.available'} />: {row.available}
                          </span>
                          {row.batch.expiryDate ? (
                            <span>
                              <T id={'batch.select.expiry'} />:{' '}
                              {row.batch.expiryDate}
                            </span>
                          ) : null}
                          {row.batch.status === 'expiring_soon' ? (
                            <Tag minimal={true} intent={Intent.WARNING}>
                              <T id={'batch.status.expiring_soon'} />
                            </Tag>
                          ) : null}
                        </div>
                      </div>
                      <NumericInput
                        value={quantity || ''}
                        min={0}
                        max={row.available}
                        buttonPosition={'none'}
                        onValueChange={(value) =>
                          setQuantity(row.batch.id, value)
                        }
                        className={'batch-allocations__quantity'}
                      />
                      {exceeded ? (
                        <span className={'batch-allocations__error'}>
                          <T id={'batch.allocate.exceeds_available'} />
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className={'batch-allocations__summary'}>
                <span>
                  <T id={'batch.allocate.allocated'} />: {allocatedTotal} /{' '}
                  {requiredQuantity}
                </span>
                {!isBalanced ? (
                  <Tag minimal={true} intent={Intent.WARNING}>
                    <T id={'batch.allocate.mismatch'} />
                  </Tag>
                ) : null}
              </div>
            </>
          )}

          <div className={'batch-allocations__footer'}>
            <Button
              small={true}
              minimal={true}
              onClick={() => setIsOpen(false)}
            >
              <T id={'cancel'} />
            </Button>
            <Button
              small={true}
              intent={Intent.PRIMARY}
              disabled={!canApply}
              onClick={handleApply}
            >
              <T id={'batch.select.apply'} />
            </Button>
          </div>
        </div>
      }
    >
      <Button
        small={true}
        minimal={true}
        icon={'selection'}
        intent={allocations?.length ? Intent.SUCCESS : Intent.NONE}
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(true);
        }}
        text={getBatchAllocationsLabel(allocations)}
      />
    </Popover2>
  );
}
