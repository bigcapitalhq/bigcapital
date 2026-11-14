import { Button, Intent, Menu, MenuItem } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import React from 'react';
import intl from 'react-intl-universal';
import type { Batch } from '@/ee/batches/hooks/query/queries';
import {
  Card,
  DataTable,
  FormatDate,
  FormatNumberCell,
  FormattedMessage as T,
  TableSkeletonRows,
} from '@/components';
import { TableStyle } from '@/constants';
import { useItemDetailDrawerContext } from '@/containers/Drawers/ItemDetailDrawer/ItemDetailDrawerProvider';
import { BatchFormPopover, BatchStatusTag } from '@/ee/batches/components';
import { useDeleteBatch, useItemBatches } from '@/ee/batches/hooks/query';

/**
 * Renders the batch date or a dash when the date is empty.
 */
function OptionalDateCell({ value }: { value?: string | null }) {
  return value ? <FormatDate value={value} /> : <span>-</span>;
}

/**
 * Item batches table columns.
 */
function useItemBatchesColumns() {
  return React.useMemo(
    () => [
      {
        id: 'batch_number',
        accessor: 'batchNumber',
        Header: intl.get('batch.column.batch_number'),
        width: 140,
      },
      {
        id: 'batch_ref',
        accessor: 'batchRef',
        Header: intl.get('batch.column.batch_ref'),
        width: 120,
      },
      {
        id: 'manufactured_date',
        accessor: 'manufacturedDate',
        Header: intl.get('batch.column.manufactured_date'),
        Cell: OptionalDateCell,
        width: 120,
      },
      {
        id: 'expiry_date',
        accessor: 'expiryDate',
        Header: intl.get('batch.column.expiry_date'),
        Cell: OptionalDateCell,
        width: 120,
      },
      {
        id: 'quantity_on_hand',
        accessor: 'quantityOnHand',
        Header: intl.get('batch.column.quantity_on_hand'),
        Cell: FormatNumberCell,
        align: 'right',
        width: 100,
      },
      {
        id: 'status',
        accessor: ({ status }: Batch) => <BatchStatusTag status={status} />,
        Header: intl.get('batch.column.status'),
        width: 110,
      },
      {
        id: 'actions',
        accessor: 'actions',
        Header: '',
        Cell: BatchActionsCell,
        width: 60,
        align: 'center',
      },
    ],
    [],
  );
}

/**
 * Batch row actions cell.
 */
function BatchActionsCell({ row: { original } }: { row: { original: Batch } }) {
  const { mutateAsync: deleteBatch, isPending } = useDeleteBatch();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDelete = async () => {
    await deleteBatch(original.id);
    setIsOpen(false);
  };

  return (
    <div className={'batch-actions'}>
      <BatchFormPopover
        itemId={original.itemId}
        batch={original}
        buttonProps={{ minimal: true, icon: 'edit' }}
        buttonText={<span className={'visually-hidden'}>Edit</span>}
        popoverClassName={'batch-form-popover-wrapper'}
      />
      <Popover2
        isOpen={isOpen}
        onInteraction={(nextOpenState) => setIsOpen(nextOpenState)}
        placement={'left-start'}
        content={
          <Menu>
            <MenuItem
              intent={Intent.DANGER}
              text={<T id={'batch.action.confirm_delete'} />}
              onClick={handleDelete}
              disabled={isPending}
            />
            <MenuItem
              text={<T id={'cancel'} />}
              onClick={() => setIsOpen(false)}
            />
          </Menu>
        }
      >
        <Button minimal={true} icon={'trash'} disabled={isPending} />
      </Popover2>
    </div>
  );
}

/**
 * Item batches tab content.
 */
export function ItemBatchesTable() {
  const { itemId, item } = useItemDetailDrawerContext();
  const columns = useItemBatchesColumns();
  const {
    data: batches,
    isLoading,
    isFetching,
  } = useItemBatches(itemId, { enabled: !!itemId });

  return (
    <Card>
      <div className={'batch-tab__header'}>
        <div>
          <h4>
            <T id={'batch.tab.title'} />
          </h4>
          <p className={'batch-tab__description'}>
            <T id={'batch.tab.description'} />
          </p>
        </div>
        {item?.type === 'inventory' && (
          <BatchFormPopover
            itemId={itemId as number}
            buttonText={<T id={'batch.tab.new_batch'} />}
            buttonProps={{ intent: Intent.PRIMARY, small: false }}
          />
        )}
      </div>

      <DataTable
        columns={columns}
        data={batches?.results ?? []}
        headerLoading={isLoading}
        progressBarLoading={isFetching}
        TableLoadingRenderer={TableSkeletonRows}
        styleName={TableStyle.Constrant}
      />
    </Card>
  );
}
