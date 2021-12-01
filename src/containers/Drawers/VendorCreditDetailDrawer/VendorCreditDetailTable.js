import React from 'react';
import clsx from 'classnames';

import { DataTable } from 'components';
import { useVendorCreditDetailDrawerContext } from './VendorCreditDetailDrawerProvider';

import { useVendorCreditReadonlyEntriesTableColumns } from './utils';

import VendorCreditDetailCls from '../../../style/components/Drawers/VendorCreditDetail.module.scss';

/**
 * Vendor Credit detail table.
 */
export default function VendorCreditDetailTable() {
  const {
    vendorCredit: { entries },
  } = useVendorCreditDetailDrawerContext();

  // Vendor Credit entries table columns.
  const columns = useVendorCreditReadonlyEntriesTableColumns();

  return (
    <div className={clsx(VendorCreditDetailCls.detail_panel_table)}>
      <DataTable
        columns={columns}
        data={entries}
        className={'table-constrant'}
      />
    </div>
  );
}
