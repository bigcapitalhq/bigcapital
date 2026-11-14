import {
  Button,
  InputGroup,
  Intent,
  NumericInput,
  Tag,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import type { Batch } from '@/ee/batches/hooks/query/queries';
import type { ItemEntryBatchAllocation } from '@/interfaces/ItemEntries';
import { FormattedMessage as T } from '@/components';
import { useBulkSaveBatches } from '@/ee/batches/hooks/query';
import { useDateInputFormatter } from '@/hooks';

interface PurchaseBatchAllocationsPopoverProps {
  itemId: number;
  entryQuantity: number | string;
  allocations?: ItemEntryBatchAllocation[];
  onApply: (allocations: ItemEntryBatchAllocation[]) => void;
  disabled?: boolean;
}

interface BatchRowState {
  key: string;
  batchId?: number;
  batch?: Batch | null;
  batchNumber: string;
  batchRef: string;
  manufacturedDate: Date | null;
  expiryDate: Date | null;
  quantity: number;
}

const toNumber = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

/**
 * Whether the row is an untouched placeholder row.
 */
const isBlankRow = (row: BatchRowState) =>
  row.batchId === undefined &&
  row.batchNumber.trim() === '' &&
  row.batchRef.trim() === '' &&
  row.manufacturedDate === null &&
  row.expiryDate === null &&
  toNumber(row.quantity) === 0;

// The server returns `DATE` columns as `YYYY-MM-DD` calendar dates. Reading
// them with `new Date()` would treat them as UTC midnight, which is the
// previous day in timezones west of UTC.
const CALENDAR_DATE = /^\d{4}-\d{2}-\d{2}$/;

const toDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const date = CALENDAR_DATE.test(value)
    ? moment(value, 'YYYY-MM-DD').toDate()
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Popover used to split a bill line quantity across multiple new batches.
 */
export function PurchaseBatchAllocationsPopover({
  itemId,
  entryQuantity,
  allocations,
  onApply,
  disabled,
}: PurchaseBatchAllocationsPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [rows, setRows] = React.useState<BatchRowState[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const hasDraftRef = React.useRef(false);
  const prevItemIdRef = React.useRef(itemId);
  const rowCounter = React.useRef(0);
  const { mutateAsync: bulkSaveBatches } = useBulkSaveBatches();
  const dateInputFormatter = useDateInputFormatter();

  const requiredQuantity = toNumber(entryQuantity);

  const createEmptyRow = (): BatchRowState => ({
    key: `row-${rowCounter.current++}`,
    batchNumber: '',
    batchRef: '',
    manufacturedDate: null,
    expiryDate: null,
    quantity: 0,
  });

  const buildRowsFromAllocations = (
    nextAllocations?: ItemEntryBatchAllocation[],
  ): BatchRowState[] => {
    const nextRows = (nextAllocations ?? []).map((allocation, index) => ({
      key: `existing-${allocation.batchId}-${index}`,
      batchId: allocation.batchId,
      batch: allocation.batch ?? null,
      batchNumber: allocation.batch?.batchNumber ?? '',
      batchRef: allocation.batch?.batchRef ?? '',
      manufacturedDate: toDate(allocation.batch?.manufacturedDate),
      expiryDate: toDate(allocation.batch?.expiryDate),
      quantity: toNumber(allocation.quantity),
    }));
    // Always keep at least one empty row so the user can start adding a batch
    // right away instead of facing an empty popover.
    return nextRows.length > 0 ? nextRows : [createEmptyRow()];
  };

  React.useEffect(() => {
    if (!isOpen) return;
    // Reopening with an unapplied draft must restore the user's input instead
    // of resetting it from the parent allocations.
    if (hasDraftRef.current) return;

    setRows(buildRowsFromAllocations(allocations));
    // The rows are only seeded when the popover opens; parent re-renders and
    // allocations changes must not reset an in-progress draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // A draft belongs to one item entry line. Clear it if the row is reused for
  // another item.
  React.useEffect(() => {
    if (prevItemIdRef.current === itemId) return;

    prevItemIdRef.current = itemId;
    hasDraftRef.current = false;
    setIsOpen(false);
  }, [itemId]);

  const updateRow = (key: string, patch: Partial<BatchRowState>) => {
    hasDraftRef.current = true;
    setRows((currentRows) =>
      currentRows.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  };

  const addRow = () => {
    setRows((currentRows) => [...currentRows, createEmptyRow()]);
  };

  const removeRow = (key: string) => {
    setRows((currentRows) => {
      const removedRow = currentRows.find((row) => row.key === key);

      if (removedRow && !isBlankRow(removedRow)) {
        hasDraftRef.current = true;
      }
      const nextRows = currentRows.filter((row) => row.key !== key);
      // Removing the last row resets it to a fresh empty row.
      return nextRows.length > 0 ? nextRows : [createEmptyRow()];
    });
  };

  const allocatedTotal = rows.reduce(
    (sum, row) => sum + toNumber(row.quantity),
    0,
  );
  const isBalanced = Math.abs(allocatedTotal - requiredQuantity) <= 0.0001;
  const isValidRows =
    rows.length > 0 &&
    rows.every(
      (row) => toNumber(row.quantity) > 0 && row.batchNumber.trim().length > 0,
    );
  const canApply = isValidRows && isBalanced && !isSaving;

  const handleApply = async () => {
    if (!canApply) return;
    setIsSaving(true);

    try {
      // Existing rows carry their `batchId` and are updated by the bulk
      // endpoint; rows without it are created. Both happen in one request and
      // one database transaction.
      const savedBatches = await bulkSaveBatches({
        itemId,
        batches: rows.map((row) => ({
          ...(row.batchId ? { batchId: row.batchId } : {}),
          batchNumber: row.batchNumber.trim(),
          batchRef: row.batchRef.trim() || null,
          manufacturedDate: row.manufacturedDate
            ? moment(row.manufacturedDate).format('YYYY-MM-DD')
            : null,
          expiryDate: row.expiryDate
            ? moment(row.expiryDate).format('YYYY-MM-DD')
            : null,
          ...(!row.batchId
            ? {
                quantity: toNumber(row.quantity),
                sourceTransactionType: 'Bill',
              }
            : {}),
        })),
      });

      const resolvedAllocations = rows
        .map<ItemEntryBatchAllocation | null>((row, index) => {
          const savedBatch = savedBatches[index];
          const batchId = savedBatch?.id ?? row.batchId;

          if (!batchId) {
            return null;
          }
          return {
            batchId,
            quantity: toNumber(row.quantity),
            batch: savedBatch ?? row.batch ?? null,
          };
        })
        .filter(
          (allocation): allocation is ItemEntryBatchAllocation =>
            allocation !== null,
        );

      onApply(resolvedAllocations);
      hasDraftRef.current = false;
      setIsOpen(false);
    } catch (error) {
      // The fetcher error handler displays the API error.
    } finally {
      setIsSaving(false);
    }
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
          className={'batch-allocations batch-allocations--purchase'}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={'batch-allocations__header'}>
            <strong>
              <T id={'batch.allocate.purchase_title'} />
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

          <div className={'batch-allocations__table-wrapper'}>
            <table className={'batch-form-table batch-allocations-table'}>
              <thead>
                <tr>
                  <th>{intl.get('batch.form.batch_number')}</th>
                  <th>{intl.get('batch.form.batch_ref')}</th>
                  <th className={'batch-form-table__col-date'}>
                    {intl.get('batch.form.manufactured_date')}
                  </th>
                  <th className={'batch-form-table__col-date'}>
                    {intl.get('batch.form.expiry_date')}
                  </th>
                  <th className={'batch-form-table__col-quantity'}>
                    {intl.get('batch.form.quantity')}
                  </th>
                  <th className={'batch-form-table__col-actions'} />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key}>
                    <td>
                      <InputGroup
                        placeholder={intl.get(
                          'batch.form.batch_number_placeholder',
                        )}
                        value={row.batchNumber}
                        fill={true}
                        onChange={(event) =>
                          updateRow(row.key, {
                            batchNumber: event.currentTarget.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <InputGroup
                        placeholder={intl.get(
                          'batch.form.batch_ref_placeholder',
                        )}
                        value={row.batchRef}
                        fill={true}
                        onChange={(event) =>
                          updateRow(row.key, {
                            batchRef: event.currentTarget.value,
                          })
                        }
                      />
                    </td>
                    <td className={'batch-form-table__col-date'}>
                      <DateInput
                        value={row.manufacturedDate}
                        onChange={(date) =>
                          updateRow(row.key, {
                            manufacturedDate: date ?? null,
                          })
                        }
                        {...dateInputFormatter}
                        placeholder={dateInputFormatter.placeholder}
                        popoverProps={{ minimal: true }}
                        fill={true}
                      />
                    </td>
                    <td className={'batch-form-table__col-date'}>
                      <DateInput
                        value={row.expiryDate}
                        onChange={(date) =>
                          updateRow(row.key, { expiryDate: date ?? null })
                        }
                        {...dateInputFormatter}
                        placeholder={dateInputFormatter.placeholder}
                        popoverProps={{ minimal: true }}
                        fill={true}
                      />
                    </td>
                    <td>
                      <NumericInput
                        value={row.quantity || ''}
                        min={0}
                        buttonPosition={'none'}
                        fill={true}
                        onValueChange={(value) =>
                          updateRow(row.key, { quantity: toNumber(value) })
                        }
                      />
                    </td>
                    <td className={'batch-form-table__col-actions'}>
                      <Button
                        small={true}
                        minimal={true}
                        icon={'trash'}
                        onClick={() => removeRow(row.key)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className={
              'batch-allocations__toolbar batch-allocations__toolbar--purchase'
            }
          >
            <Button small={true} minimal={true} icon={'add'} onClick={addRow}>
              <T id={'batch.allocate.add_batch'} />
            </Button>
            <div className={'batch-allocations__toolbar-meta'}>
              {!isBalanced ? (
                <Tag minimal={true} intent={Intent.WARNING}>
                  <T id={'batch.allocate.mismatch'} />
                </Tag>
              ) : null}
            </div>
          </div>

          <div className={'batch-allocations__footer'}>
            <Button
              small={true}
              minimal={true}
              onClick={handleClose}
              disabled={isSaving}
            >
              <T id={'close'} />
            </Button>
            <Button
              small={true}
              intent={Intent.PRIMARY}
              className={'batch-allocations__apply-btn'}
              loading={isSaving}
              disabled={!canApply}
              onClick={handleApply}
            >
              <T id={'batch.select.apply'} />
            </Button>
          </div>
        </div>
      }
    >
      <Tooltip2
        content={intl.get('batch.allocate.purchase_tooltip')}
        placement={'top'}
      >
        <Button
          small={true}
          minimal={true}
          icon={'full-stacked-chart'}
          intent={allocations?.length ? Intent.SUCCESS : Intent.NONE}
          aria-label={intl.get('batch.allocate.purchase_tooltip')}
        />
      </Tooltip2>
    </Popover2>
  );
}
