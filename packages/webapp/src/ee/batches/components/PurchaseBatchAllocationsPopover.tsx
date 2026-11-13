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
import { useCreateBatch } from '@/ee/batches/hooks/query';
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

          {rows.length === 0 ? (
            <div className={'batch-allocations__empty'}>
              <T id={'batch.allocate.no_batches'} />
            </div>
          ) : (
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
                      {row.batchId ? (
                        <>
                          <td className={'batch-form-table__text'}>
                            {row.batchNumber}
                          </td>
                          <td className={'batch-form-table__text'}>
                            {row.batchRef || '-'}
                          </td>
                          <td className={'batch-form-table__text'}>
                            {row.manufacturedDate
                              ? dateInputFormatter.formatDate(
                                  row.manufacturedDate,
                                )
                              : '-'}
                          </td>
                          <td className={'batch-form-table__text'}>
                            {row.expiryDate
                              ? dateInputFormatter.formatDate(row.expiryDate)
                              : '-'}
                          </td>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
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
          )}

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
              onClick={() => setIsOpen(false)}
            >
              <T id={'cancel'} />
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
