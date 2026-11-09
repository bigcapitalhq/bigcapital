import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';
import { useEstimateReadonlyEntriesColumns } from './utils';
import { CommercialDocEntriesTable } from '@/components';
import { TableStyle } from '@/constants';

/**
 * Estimate detail table.
 */
export function EstimateDetailTable() {
  const { estimate } = useEstimateDetailDrawerContext();
  const entries = estimate?.entries || [];

  // Estimate entries table columns.
  const columns = useEstimateReadonlyEntriesColumns();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={entries}
      initialHiddenColumns={
        // If any entry has no discount, hide the discount column.
        entries?.some((e) => e.discountFormatted) ? [] : ['discount']
      }
      styleName={TableStyle.Constrant}
    />
  );
}
