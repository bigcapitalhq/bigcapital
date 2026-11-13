import { Button, Intent, NumericInput, Tag } from '@blueprintjs/core';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
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
            <div className={'batch-allocations__header-meta'}>
              <span className={'batch-allocations__required'}>
                <T id={'batch.allocate.required'} />: {requiredQuantity}
              </span>
              <span className={'batch-allocations__allocated'}>
                <T id={'batch.allocate.allocated'} />: {allocatedTotal} /{' '}
                {requiredQuantity}
              </span>
            </div>
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

              <div className={'batch-allocations__table-wrapper'}>
                <table className={'batch-form-table batch-allocations-table'}>
                  <thead>
                    <tr>
                      <th>{intl.get('batch.form.batch_number')}</th>
                      <th>{intl.get('batch.form.batch_ref')}</th>
                      <th className={'batch-form-table__col-date'}>
                        {intl.get('batch.select.expiry')}
                      </th>
                      <th className={'batch-form-table__col-available'}>
                        {intl.get('batch.select.available')}
                      </th>
                      <th className={'batch-form-table__col-quantity'}>
                        {intl.get('batch.select.quantity_out')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const quantity = toNumber(quantities[row.batch.id]);
                      const exceeded = quantity > row.available + 0.0001;

                      return (
                        <tr key={row.batch.id}>
                          <td className={'batch-form-table__text'}>
                            <strong>{row.batch.batchNumber}</strong>
                            {row.batch.status === 'expiring_soon' ? (
                              <Tag
                                minimal={true}
                                intent={Intent.WARNING}
                                className={'ml1'}
                              >
                                <T id={'batch.status.expiring_soon'} />
                              </Tag>
                            ) : null}
                          </td>
                          <td className={'batch-form-table__text'}>
                            {row.batch.batchRef || '-'}
                          </td>
                          <td
                            className={
                              'batch-form-table__text batch-form-table__col-date'
                            }
                          >
                            {row.batch.expiryDate || '-'}
                          </td>
                          <td className={'batch-form-table__number'}>
                            {row.available}
                          </td>
                          <td>
                            <NumericInput
                              value={quantity || ''}
                              min={0}
                              max={row.available}
                              buttonPosition={'none'}
                              fill={true}
                              onValueChange={(value) =>
                                setQuantity(row.batch.id, value)
                              }
                            />
                            {exceeded ? (
                              <span className={'batch-form__cell-error'}>
                                <T id={'batch.allocate.exceeds_available'} />
                              </span>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {!isBalanced ? (
                <div className={'batch-allocations__summary'}>
                  <Tag minimal={true} intent={Intent.WARNING}>
                    <T id={'batch.allocate.mismatch'} />
                  </Tag>
                </div>
              ) : null}
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
              className={'batch-allocations__apply-btn'}
              disabled={!canApply}
              onClick={handleApply}
            >
              <T id={'batch.select.apply'} />
            </Button>
          </div>
        </div>
      }
    >
      <Tooltip2 content={intl.get('batch.select.tooltip')} placement={'top'}>
        <Button
          small={true}
          minimal={true}
          icon={'full-stacked-chart'}
          intent={allocations?.length ? Intent.SUCCESS : Intent.NONE}
          aria-label={intl.get('batch.select.tooltip')}
        />
      </Tooltip2>
    </Popover2>
  );
}
