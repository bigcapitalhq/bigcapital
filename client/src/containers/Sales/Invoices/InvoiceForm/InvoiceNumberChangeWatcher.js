import { useEffect } from 'react';
import { useFormikContext } from 'formik';

import withInvoices from './withInvoices';
import withInvoiceActions from './withInvoiceActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

function InvoiceNumberChangeWatcher({
  invoiceNumber,

  // #WithInvoiceActions
  setInvoiceNumberChanged,

  // #withInvoices
  invoiceNumberChanged,

  // #withDashboardActions
  changePageSubtitle,
}) {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (invoiceNumberChanged) {
      setFieldValue('invoice_no', invoiceNumber);
      changePageSubtitle(`No. ${invoiceNumber}`);
      setInvoiceNumberChanged(false);
    }
  }, [
    invoiceNumber,
    invoiceNumberChanged,
    setFieldValue,
    changePageSubtitle,
    setInvoiceNumberChanged,
  ]);
  return null;
}

export default compose(
  withInvoices(({ invoiceNumberChanged }) => ({ invoiceNumberChanged })),
  withInvoiceActions,
  withDashboardActions,
)(InvoiceNumberChangeWatcher);
