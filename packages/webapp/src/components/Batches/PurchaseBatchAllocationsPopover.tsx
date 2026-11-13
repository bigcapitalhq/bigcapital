import {
  Button,
  InputGroup,
  Intent,
  NumericInput,
  Tag,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { Popover2 } from '@blueprintjs/popover2';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import { getBatchAllocationsLabel } from './SaleBatchAllocationsPopover';
import type { Batch } from '@/hooks/query/batches/queries';
import type { ItemEntryBatchAllocation } from '@/interfaces/ItemEntries';
import { FormattedMessage as T } from '@/components';
import { useDateInputFormatter } from '@/hooks';
import { useCreateBatch } from '@/hooks/query';

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

const toDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const date = new Date(value);
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
  const rowCounter = React.useRef(0);
  const { mutateAsync: createBatch } = useCreateBatch();
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

  React.useEffect(() => {
    if (!isOpen) return;

    setRows(
      (allocations ?? []).map((allocation, index) => ({
        key: `existing-${allocation.batchId}-${index}`,
        batchId: allocation.batchId,
        batch: allocation.batch ?? null,
        batchNumber: allocation.batch?.batchNumber ?? '',
        batchRef: allocation.batch?.batchRef ?? '',
        manufacturedDate: toDate(allocation.batch?.manufacturedDate),
        expiryDate: toDate(allocation.batch?.expiryDate),
        quantity: toNumber(allocation.quantity),
      })),
    );
    // The rows are only initialized when the popover transitions to open;
    // subsequent parent re-renders must not reset the user's input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const updateRow = (key: string, patch: Partial<BatchRowState>) => {
    setRows((currentRows) =>
      currentRows.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  };

  const addRow = () => {
    setRows((currentRows) => [...currentRows, createEmptyRow()]);
  };

  const removeRow = (key: string) => {
    setRows((currentRows) => currentRows.filter((row) => row.key !== key));
  };

  const allocatedTotal = rows.reduce(
    (sum, row) => sum + toNumber(row.quantity),
    0,
  );
  const isBalanced = Math.abs(allocatedTotal - requiredQuantity) <= 0.0001;
  const isValidRows =
    rows.length > 0 &&
    rows.every(
      (row) =>
        toNumber(row.quantity) > 0 &&
        (row.batchId !== undefined ? true : row.batchNumber.trim().length > 0),
    );
  const canApply = isValidRows && isBalanced && !isSaving;

  const handleApply = async () => {
    if (!canApply) return;
    setIsSaving(true);

    try {
      const resolvedAllocations: ItemEntryBatchAllocation[] = [];

      for (const row of rows) {
        if (row.batchId) {
          resolvedAllocations.push({
            batchId: row.batchId,
            quantity: toNumber(row.quantity),
            batch: row.batch,
          });
          continue;
        }
        const createdBatch = await createBatch({
          itemId,
          batchNumber: row.batchNumber.trim(),
          batchRef: row.batchRef.trim() || undefined,
          manufacturedDate: row.manufacturedDate
            ? moment(row.manufacturedDate).format('YYYY-MM-DD')
            : undefined,
          expiryDate: row.expiryDate
            ? moment(row.expiryDate).format('YYYY-MM-DD')
            : undefined,
          quantity: toNumber(row.quantity),
          sourceTransactionType: 'Bill',
        });
        resolvedAllocations.push({
          batchId: createdBatch.id,
          quantity: toNumber(row.quantity),
          batch: createdBatch,
        });
      }
      onApply(resolvedAllocations);
      setIsOpen(false);
    } catch (error) {
      // The fetcher error handler displays the API error.
    } finally {
      setIsSaving(false);
    }
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
          className={'batch-allocations batch-allocations--purchase'}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={'batch-allocations__header'}>
            <strong>
              <T id={'batch.allocate.purchase_title'} />
            </strong>
            <span>
              <T id={'batch.allocate.required'} />: {requiredQuantity}
            </span>
          </div>

          {rows.length === 0 ? (
            <div className={'batch-allocations__empty'}>
              <T id={'batch.allocate.no_batches'} />
            </div>
          ) : (
            <div className={'batch-allocations__rows'}>
              {rows.map((row) => (
                <div
                  key={row.key}
                  className={'batch-allocations__purchase-row'}
                >
                  <div className={'batch-allocations__purchase-row-header'}>
                    <strong>
                      {row.batchId ? (
                        row.batchNumber
                      ) : (
                        <T id={'batch.form.new_title'} />
                      )}
                    </strong>
                    <Button
                      small={true}
                      minimal={true}
                      icon={'trash'}
                      onClick={() => removeRow(row.key)}
                    />
                  </div>

                  {row.batchId ? (
                    <div className={'batch-allocations__meta'}>
                      {row.batchRef ? <span>{row.batchRef}</span> : null}
                      {row.manufacturedDate ? (
                        <span>
                          <T id={'batch.form.manufactured_date'} />:{' '}
                          {dateInputFormatter.formatDate(row.manufacturedDate)}
                        </span>
                      ) : null}
                      {row.expiryDate ? (
                        <span>
                          <T id={'batch.form.expiry_date'} />:{' '}
                          {dateInputFormatter.formatDate(row.expiryDate)}
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      <InputGroup
                        placeholder={intl.get(
                          'batch.form.batch_number_placeholder',
                        )}
                        value={row.batchNumber}
                        onChange={(event) =>
                          updateRow(row.key, {
                            batchNumber: event.currentTarget.value,
                          })
                        }
                      />
                      <InputGroup
                        placeholder={intl.get(
                          'batch.form.batch_ref_placeholder',
                        )}
                        value={row.batchRef}
                        onChange={(event) =>
                          updateRow(row.key, {
                            batchRef: event.currentTarget.value,
                          })
                        }
                      />
                      <div className={'batch-allocations__dates'}>
                        <DateInput
                          value={row.manufacturedDate}
                          onChange={(date) =>
                            updateRow(row.key, {
                              manufacturedDate: date ?? null,
                            })
                          }
                          {...dateInputFormatter}
                          placeholder={intl.get('batch.form.manufactured_date')}
                          popoverProps={{ minimal: true }}
                        />
                        <DateInput
                          value={row.expiryDate}
                          onChange={(date) =>
                            updateRow(row.key, { expiryDate: date ?? null })
                          }
                          {...dateInputFormatter}
                          placeholder={intl.get('batch.form.expiry_date')}
                          popoverProps={{ minimal: true }}
                        />
                      </div>
                    </>
                  )}

                  <div className={'batch-allocations__quantity-row'}>
                    <span>
                      <T id={'batch.form.quantity'} />
                    </span>
                    <NumericInput
                      value={row.quantity || ''}
                      min={0}
                      buttonPosition={'none'}
                      onValueChange={(value) =>
                        updateRow(row.key, { quantity: toNumber(value) })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={'batch-allocations__toolbar'}>
            <Button small={true} minimal={true} icon={'add'} onClick={addRow}>
              <T id={'batch.allocate.add_batch'} />
            </Button>
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
      <Button
        small={true}
        minimal={true}
        icon={'add'}
        intent={allocations?.length ? Intent.SUCCESS : Intent.PRIMARY}
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(true);
        }}
        text={
          allocations?.length
            ? getBatchAllocationsLabel(allocations)
            : intl.get('batch.allocate.add_batches')
        }
      />
    </Popover2>
  );
}
