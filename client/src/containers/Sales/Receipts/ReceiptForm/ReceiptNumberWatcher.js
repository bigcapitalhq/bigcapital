import { useEffect } from 'react';
import { useFormikContext } from 'formik';

import withDashboardActions from "containers/Dashboard/withDashboardActions";
import withReceipts from './withReceipts';
import withReceiptActions from './withReceiptActions';

import { compose } from 'utils';

function ReceiptNumberWatcher({
  receiptNumber, 

  // #withDashboardActions
  changePageSubtitle,

  // #withReceipts
  receiptNumberChanged,

  //#withReceiptActions
  setReceiptNumberChanged,
}) {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (receiptNumberChanged) {
      setFieldValue('receipt_number', receiptNumber);
      changePageSubtitle(`No. ${receiptNumber}`);
      setReceiptNumberChanged(false);
    }
  }, [
    receiptNumber,
    receiptNumberChanged,
    setReceiptNumberChanged,
    setFieldValue,
    changePageSubtitle,
  ]);

  return null
}

export default compose(
  withReceipts(({ receiptNumberChanged }) => ({ receiptNumberChanged })),
  withReceiptActions,
  withDashboardActions
)(ReceiptNumberWatcher);