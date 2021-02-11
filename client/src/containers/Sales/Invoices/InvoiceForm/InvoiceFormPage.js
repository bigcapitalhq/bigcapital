import React, { useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import InvoiceForm from './InvoiceForm';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

import 'style/pages/SaleInvoice/PageForm.scss';
import { InvoiceFormProvider } from './InvoiceFormProvider';

/**
 * Invoice form page.
 */
function InvoiceFormPage({
  // #withDashboardActions
  setSidebarShrink,
  resetSidebarPreviousExpand,
  setDashboardBackLink,
}) {
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    // Shrink the sidebar by foce.
    setSidebarShrink();
    // Show the back link on dashboard topbar.
    setDashboardBackLink(true);

    return () => {
      // Reset the sidebar to the previous status.
      resetSidebarPreviousExpand();
      // Hide the back link on dashboard topbar.
      setDashboardBackLink(false);
    };
  }, [resetSidebarPreviousExpand, setSidebarShrink, setDashboardBackLink]);

  const handleFormSubmit = useCallback(
    (payload) => {
      payload.redirect && history.push('/invoices');
    },
    [history],
  );

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <InvoiceFormProvider invoiceId={id}>
      <InvoiceForm
        onFormSubmit={handleFormSubmit}
        onCancelForm={handleCancel}
      />
    </InvoiceFormProvider>
  );
}

export default compose(
  withDashboardActions,
)(InvoiceFormPage);
