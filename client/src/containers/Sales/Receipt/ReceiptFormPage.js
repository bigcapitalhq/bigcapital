import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import ReceiptFrom from './ReceiptForm';
import { ReceiptFormProvider } from './ReceiptFormProvider';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

/**
 * Receipt form page.
 */
function ReceiptFormPage({
  // #withDashboardActions
  setSidebarShrink,
  resetSidebarPreviousExpand,
  setDashboardBackLink,
}) {
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

  
  // const handleFormSubmit = useCallback(
  //   (payload) => {
  //     payload.redirect && history.push('/receipts');
  //   },
  //   [history],
  // );

  // const handleCancel = useCallback(() => {
  //   history.goBack();
  // }, [history]);

  return (
    <ReceiptFormProvider receiptId={id}>
      <ReceiptFrom />
    </ReceiptFormProvider>
  );
}

export default compose(
  withDashboardActions,
)(ReceiptFormPage);
