import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';
import { useReceiptReadonlyEntriesTableColumns } from './utils';
import { CommercialDocEntriesTable } from '@/components';
import { TableStyle } from '@/constants';

/**
 * Receipt readonly details table columns.
 */
export function ReceiptDetailTable() {
  // Receipt details drawer context.
  const { receipt } = useReceiptDetailDrawerContext();
  const entries = receipt?.entries ?? [];

  // Receipt readonly entries table columns.
  const columns = useReceiptReadonlyEntriesTableColumns();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={entries}
      initialHiddenColumns={
        // If any entry has no discount, hide the discount column.
        entries.some((e) => e.discountFormatted) ? [] : ['discount']
      }
      styleName={TableStyle.Constrant}
    />
  );
}
