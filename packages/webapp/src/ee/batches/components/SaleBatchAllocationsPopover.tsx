import { Button, Intent, MenuItem, NumericInput, Tag } from '@blueprintjs/core';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import { Select2 } from '@blueprintjs/select';
import React from 'react';
import intl from 'react-intl-universal';
import { BatchStatusTag } from './BatchStatusTag';
import type { Batch } from '@/ee/batches/hooks/query/queries';
import type { ItemEntryBatchAllocation } from '@/interfaces/ItemEntries';
import type { ItemRenderer } from '@blueprintjs/select';
import { FormattedMessage as T } from '@/components';
import { useItemBatches } from '@/ee/batches/hooks/query';

interface SaleBatchAllocationsPopoverProps {
  itemId: number;
  entryQuantity: number | string;
  allocations?: ItemEntryBatchAllocation[];
  onApply: (allocations: ItemEntryBatchAllocation[]) => void;
  disabled?: boolean;
}

interface BatchOption {
  batch: Batch;
  available: number;
}

interface AllocationRow {
  key: string;
  batchId: number | null;
  quantity: number;
}

const EPSILON = 0.0001;

const toNumber = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

/**
 * Retrieves the total allocated quantity of the given rows.
 */
const getRowsTotal = (rows: AllocationRow[]): number => {
  return rows.reduce((total, row) => {
    return row.batchId === null ? total : total + toNumber(row.quantity);
  }, 0);
};

/**
 * Sorts batch options by expiry date (first expiry first out).
 */
const sortBatchOptions = (a: BatchOption, b: BatchOption): number => {
  if (!a.batch.expiryDate && !b.batch.expiryDate) return 0;
  if (!a.batch.expiryDate) return 1;
  if (!b.batch.expiryDate) return -1;
  return (
    new Date(a.batch.expiryDate).getTime() -
    new Date(b.batch.expiryDate).getTime()
  );
};

/**
 * Filters the batch options by the given search query.
 */
const filterBatchOption = (query: string, option: BatchOption): boolean => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return true;

  const batchNumber = (option.batch.batchNumber ?? '').toLowerCase();
  const batchRef = (option.batch.batchRef ?? '').toLowerCase();

  return (
    batchNumber.includes(normalizedQuery) || batchRef.includes(normalizedQuery)
  );
};

/**
 * Batch option item renderer.
 */
const renderBatchOption: ItemRenderer<BatchOption> = (
  option,
  { handleClick, modifiers },
) => {
  if (!modifiers.matchesPredicate) return null;

  const { batch, available } = option;

  return (
    <MenuItem
      key={batch.id}
      active={modifiers.active}
      disabled={modifiers.disabled}
      onClick={handleClick}
      text={
        <span className={'batch-allocations__batch-option'}>
          <span className={'batch-allocations__batch-option-title'}>
            <strong>{batch.batchNumber}</strong>
            {batch.status === 'expiring_soon' ? (
              <BatchStatusTag status={batch.status} />
            ) : null}
          </span>
          <span className={'batch-allocations__batch-option-meta'}>
            {batch.batchRef ? `${batch.batchRef} · ` : null}
            {batch.expiryDate ? `${batch.expiryDate} · ` : null}
            {intl.get('batch.select.available')}: {available}
          </span>
        </span>
      }
    />
  );
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
  const [rows, setRows] = React.useState<AllocationRow[]>([]);
  const hasDraftRef = React.useRef(false);
  const prevItemIdRef = React.useRef(itemId);
  const rowCounter = React.useRef(0);
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

  const createEmptyRow = (): AllocationRow => ({
    key: `row-${rowCounter.current++}`,
    batchId: null,
    quantity: 0,
  });

  // Keeps the batch objects of the current allocations even when the batches
  // list request has not finished loading yet.
  const batchById = React.useMemo(() => {
    const map = new Map<number, Batch>();

    ((batchesData?.results ?? []) as Batch[]).forEach((batch) => {
      map.set(batch.id, batch);
    });
    (allocations ?? []).forEach((allocation) => {
      if (allocation.batch && !map.has(allocation.batchId)) {
        map.set(allocation.batchId, allocation.batch);
      }
    });
    return map;
  }, [batchesData, allocations]);

  // The available quantity of a batch takes into account the quantity that is
  // already allocated to this line, since the allocation is replaced on save.
  const batchOptionsById = React.useMemo(() => {
    const options = new Map<number, BatchOption>();

    batchById.forEach((batch, batchId) => {
      const isAllocated = allocatedByBatch[batchId] !== undefined;
      const isSelectableStatus =
        batch.status === 'active' || batch.status === 'expiring_soon';
      const onHand = toNumber(batch.quantityOnHand);

      if (
        (!isSelectableStatus && !isAllocated) ||
        (onHand <= 0 && !isAllocated)
      ) {
        return;
      }
      options.set(batchId, {
        batch,
        available: Math.max(onHand + toNumber(allocatedByBatch[batchId]), 0),
      });
    });
    return options;
  }, [batchById, allocatedByBatch]);

  const batchOptions = React.useMemo(
    () => Array.from(batchOptionsById.values()).sort(sortBatchOptions),
    [batchOptionsById],
  );

  const buildRowsFromAllocations = (
    nextAllocations?: ItemEntryBatchAllocation[],
  ): AllocationRow[] => {
    const nextRows: AllocationRow[] = (nextAllocations ?? []).map(
      (allocation, index) => ({
        key: `existing-${allocation.batchId}-${index}-${rowCounter.current++}`,
        batchId: allocation.batchId,
        quantity: toNumber(allocation.quantity),
      }),
    );

    if (nextRows.length === 0) {
      return [createEmptyRow()];
    }
    // Keep a blank row to let the user allocate the remaining quantity.
    if (getRowsTotal(nextRows) + EPSILON < requiredQuantity) {
      nextRows.push(createEmptyRow());
    }
    return nextRows;
  };

  React.useEffect(() => {
    if (!isOpen) return;
    // Reopening with an unapplied draft must restore the user's input instead
    // of resetting it from the parent allocations.
    if (hasDraftRef.current) return;

    setRows(buildRowsFromAllocations(allocations));
    // The rows are only seeded when the popover transitions to open;
    // subsequent parent re-renders must not reset the user's input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // A draft belongs to one item entry line. Clear it if the row is reused for
  // another item.
  React.useEffect(() => {
    if (prevItemIdRef.current === itemId) return;

    prevItemIdRef.current = itemId;
    hasDraftRef.current = false;
    setRows([]);
    setIsOpen(false);
  }, [itemId]);

  /**
   * Appends a blank row when the line quantity is not fully allocated and
   * there is still an unselected batch available.
   */
  const appendEmptyRowIfNeeded = (
    nextRows: AllocationRow[],
  ): AllocationRow[] => {
    if (getRowsTotal(nextRows) + EPSILON >= requiredQuantity) {
      return nextRows;
    }
    if (nextRows.some((row) => row.batchId === null)) {
      return nextRows;
    }
    const selectedBatchIds = new Set(
      nextRows
        .filter((row) => row.batchId !== null)
        .map((row) => row.batchId as number),
    );
    const hasUnselectedBatch = batchOptions.some(
      (option) =>
        option.available > EPSILON && !selectedBatchIds.has(option.batch.id),
    );
    return hasUnselectedBatch ? [...nextRows, createEmptyRow()] : nextRows;
  };

  /**
   * Keeps exactly one blank row while the line quantity is not fully
   * allocated, and removes blank rows once it is.
   */
  const reconcileBlankRows = (nextRows: AllocationRow[]): AllocationRow[] => {
    if (getRowsTotal(nextRows) + EPSILON >= requiredQuantity) {
      const filledRows = nextRows.filter((row) => row.batchId !== null);

      return filledRows.length > 0 ? filledRows : nextRows;
    }
    return appendEmptyRowIfNeeded(nextRows);
  };

  const handleBatchSelect = (rowKey: string, batch: Batch) => {
    const option = batchOptionsById.get(batch.id);

    if (!option) return;

    hasDraftRef.current = true;
    setRows((currentRows) => {
      const targetRow = currentRows.find((row) => row.key === rowKey);

      if (!targetRow || targetRow.batchId === batch.id) {
        return currentRows;
      }
      const otherRowsTotal = getRowsTotal(
        currentRows.filter((row) => row.key !== rowKey),
      );
      const remaining = Math.max(requiredQuantity - otherRowsTotal, 0);
      const quantity = Math.min(option.available, remaining);

      const nextRows = currentRows.map((row) =>
        row.key === rowKey ? { ...row, batchId: batch.id, quantity } : row,
      );
      return reconcileBlankRows(nextRows);
    });
  };

  const handleQuantityChange = (rowKey: string, value: number) => {
    hasDraftRef.current = true;
    setRows((currentRows) =>
      reconcileBlankRows(
        currentRows.map((row) =>
          row.key === rowKey
            ? { ...row, quantity: Math.max(toNumber(value), 0) }
            : row,
        ),
      ),
    );
  };

  const handleRemoveRow = (rowKey: string) => {
    hasDraftRef.current = true;
    setRows((currentRows) => {
      const removedRow = currentRows.find((row) => row.key === rowKey);
      const nextRows = currentRows.filter((row) => row.key !== rowKey);

      if (nextRows.length === 0) {
        return [createEmptyRow()];
      }
      // Removing a blank row should not immediately replace it with another
      // blank row.
      return removedRow?.batchId === null
        ? nextRows
        : reconcileBlankRows(nextRows);
    });
  };

  const handleAddRow = () => {
    hasDraftRef.current = true;
    setRows((currentRows) => [...currentRows, createEmptyRow()]);
  };

  const handleClear = () => {
    hasDraftRef.current = true;
    setRows([createEmptyRow()]);
  };

  const allocatedTotal = getRowsTotal(rows);
  const isBalanced = Math.abs(allocatedTotal - requiredQuantity) <= EPSILON;
  const hasExceededAvailable = rows.some((row) => {
    if (row.batchId === null) return false;

    const option = batchOptionsById.get(row.batchId);
    return option ? row.quantity > option.available + EPSILON : false;
  });
  const hasIncompleteRow = rows.some(
    (row) => row.batchId !== null && toNumber(row.quantity) <= 0,
  );
  const canApply =
    requiredQuantity > 0 &&
    allocatedTotal > 0 &&
    isBalanced &&
    !hasExceededAvailable &&
    !hasIncompleteRow;

  const hasBlankRow = rows.some((row) => row.batchId === null);
  const selectedBatchIds = new Set(
    rows
      .filter((row) => row.batchId !== null)
      .map((row) => row.batchId as number),
  );
  const hasUnselectedAvailableBatch = batchOptions.some(
    (option) =>
      option.available > EPSILON && !selectedBatchIds.has(option.batch.id),
  );
  const canAddRow =
    !hasBlankRow &&
    hasUnselectedAvailableBatch &&
    allocatedTotal + EPSILON < requiredQuantity;
  const hasSelectedBatch = rows.some((row) => row.batchId !== null);
  const showNoAvailableBatches =
    !isLoading && batchOptions.length === 0 && !hasSelectedBatch;

  const handleApply = () => {
    if (!canApply) return;
    const nextAllocations = rows
      .filter((row) => row.batchId !== null && toNumber(row.quantity) > 0)
      .map<ItemEntryBatchAllocation>((row) => ({
        batchId: row.batchId as number,
        quantity: toNumber(row.quantity),
        batch: batchOptionsById.get(row.batchId as number)?.batch ?? null,
      }));

    onApply(nextAllocations);
    hasDraftRef.current = false;
    setIsOpen(false);
  };

  // Closing hides the popover but keeps the current rows as a draft so
  // reopening restores the user's input.
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Popover2
      isOpen={isOpen}
      // The popover is closed only through its Close button. Ignoring the
      // close interaction avoids accidental dismissal when clicking outside.
      onInteraction={(nextOpenState) => {
        if (nextOpenState) setIsOpen(true);
      }}
      canEscapeKeyClose={false}
      // Keep the page usable while the popover stays open; outside clicks
      // must not be blocked or forced back into the popover.
      enforceFocus={false}
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
          ) : showNoAvailableBatches ? (
            <div className={'batch-allocations__empty'}>
              <T id={'batch.select.no_available_batches'} />
            </div>
          ) : (
            <>
              <div className={'batch-allocations__table-wrapper'}>
                <table
                  className={
                    'batch-form-table batch-allocations-table batch-allocations-table--sale'
                  }
                >
                  <thead>
                    <tr>
                      <th className={'batch-form-table__col-batch'}>
                        {intl.get('batch.form.batch_number')}
                      </th>
                      <th className={'batch-form-table__col-status'}>
                        {intl.get('batch.column.status')}
                      </th>
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
                      <th className={'batch-form-table__col-actions'} />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const selectedOption =
                        row.batchId !== null
                          ? batchOptionsById.get(row.batchId)
                          : undefined;
                      const selectedBatch = selectedOption?.batch ?? null;
                      const available = selectedOption?.available ?? 0;
                      const quantity = toNumber(row.quantity);
                      const exceeded = selectedBatch
                        ? quantity > available + EPSILON
                        : false;

                      const otherSelectedBatchIds = new Set(
                        rows
                          .filter(
                            (item) =>
                              item.key !== row.key && item.batchId !== null,
                          )
                          .map((item) => item.batchId as number),
                      );
                      const rowOptions = batchOptions.filter(
                        (option) => !otherSelectedBatchIds.has(option.batch.id),
                      );
                      // Keep the current batch visible even if it is no longer
                      // part of the selectable options.
                      if (
                        selectedBatch &&
                        !rowOptions.some(
                          (option) => option.batch.id === selectedBatch.id,
                        )
                      ) {
                        rowOptions.unshift({ batch: selectedBatch, available });
                      }

                      return (
                        <tr key={row.key}>
                          <td>
                            <Select2<BatchOption>
                              items={rowOptions}
                              itemRenderer={renderBatchOption}
                              itemPredicate={filterBatchOption}
                              onItemSelect={(option) =>
                                handleBatchSelect(row.key, option.batch)
                              }
                              filterable={true}
                              resetOnClose={true}
                              inputProps={{
                                placeholder: intl.get(
                                  'batch.search.placeholder',
                                ),
                                small: true,
                              }}
                              noResults={
                                <MenuItem
                                  disabled={true}
                                  text={intl.get('batch.search.no_results')}
                                />
                              }
                              popoverProps={{
                                minimal: true,
                                placement: 'bottom-start',
                                popoverClassName:
                                  'batch-allocations__batch-popover',
                              }}
                              popoverTargetProps={{
                                className: 'batch-form-table__batch-select',
                              }}
                              disabled={rowOptions.length === 0}
                              fill={true}
                            >
                              <Button
                                small={true}
                                fill={true}
                                alignText={'left'}
                                rightIcon={'double-caret-vertical'}
                                disabled={rowOptions.length === 0}
                                text={
                                  selectedBatch?.batchNumber ??
                                  intl.get('batch.select.placeholder')
                                }
                              />
                            </Select2>
                          </td>
                          <td className={'batch-form-table__col-status'}>
                            {selectedBatch?.status ? (
                              <BatchStatusTag status={selectedBatch.status} />
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className={'batch-form-table__text'}>
                            {selectedBatch?.batchRef || '-'}
                          </td>
                          <td
                            className={
                              'batch-form-table__text batch-form-table__col-date'
                            }
                          >
                            {selectedBatch?.expiryDate || '-'}
                          </td>
                          <td className={'batch-form-table__number'}>
                            {selectedBatch ? available : '-'}
                          </td>
                          <td>
                            <NumericInput
                              value={quantity || ''}
                              min={0}
                              max={selectedBatch ? available : undefined}
                              disabled={!selectedBatch}
                              buttonPosition={'none'}
                              fill={true}
                              onValueChange={(value) =>
                                handleQuantityChange(row.key, value)
                              }
                            />
                            {exceeded ? (
                              <span className={'batch-form__cell-error'}>
                                <T id={'batch.allocate.exceeds_available'} />
                              </span>
                            ) : null}
                          </td>
                          <td className={'batch-form-table__col-actions'}>
                            <Button
                              small={true}
                              minimal={true}
                              icon={'trash'}
                              aria-label={intl.get('item_entries.remove_row')}
                              onClick={() => handleRemoveRow(row.key)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className={'batch-allocations__toolbar'}>
                <Button
                  small={true}
                  minimal={true}
                  icon={'add'}
                  disabled={!canAddRow}
                  onClick={handleAddRow}
                >
                  <T id={'batch.allocate.add_batch'} />
                </Button>
                <Button small={true} minimal={true} onClick={handleClear}>
                  <T id={'batch.allocate.clear'} />
                </Button>
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
            <Button small={true} minimal={true} onClick={handleClose}>
              <T id={'close'} />
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
