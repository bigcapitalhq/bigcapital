import React from 'react';
import { useParams } from 'react-router-dom';

import 'style/pages/SaleReceipt/PageForm.scss';

import ReceiptFrom from './ReceiptForm';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';
import { ReceiptFormProvider } from './ReceiptFormProvider';

import { compose } from 'utils';

/**
 * Receipt form page.
 */
function ReceiptFormPage({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { id } = useParams();
  const idInt = parseInt(id, 10);

  return (
    <ReceiptFormProvider receiptId={idInt} baseCurrency={base_currency}>
      <ReceiptFrom />
    </ReceiptFormProvider>
  );
}
export default compose(withCurrentOrganization())(ReceiptFormPage);
