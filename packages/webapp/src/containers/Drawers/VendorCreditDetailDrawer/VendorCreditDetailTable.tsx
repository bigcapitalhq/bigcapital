import { useVendorCreditReadonlyEntriesTableColumns } from './utils';
import { useVendorCreditDetailDrawerContext } from './VendorCreditDetailDrawerProvider';
import { CommercialDocEntriesTable } from '@/components';
import { TableStyle } from '@/constants';

/**
 * Vendor Credit detail table.
 */
export function VendorCreditDetailTable() {
  const { vendorCredit } = useVendorCreditDetailDrawerContext();
  const entries = vendorCredit?.entries ?? [];

  // Vendor Credit entries table columns.
  const columns = useVendorCreditReadonlyEntriesTableColumns();

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
