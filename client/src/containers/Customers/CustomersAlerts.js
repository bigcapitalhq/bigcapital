import React from 'react';
import CustomerDeleteAlert from 'containers/Alerts/Customers/CustomerDeleteAlert';
// import CustomerBulkDeleteAlert from 'containers/Alerts/Customers/CustomerBulkDeleteAlert';

/**
 * Customers alert.
 */
export default function ItemsAlerts() {
  return (
    <div>
      <CustomerDeleteAlert name={'customer-delete'} />
      {/* <CustomerBulkDeleteAlert name={'customers-bulk-delete'} /> */}
    </div>
  );
}
