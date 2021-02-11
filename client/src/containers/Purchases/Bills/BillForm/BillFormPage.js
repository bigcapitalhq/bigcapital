import React, { useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import BillForm from './BillForm';

import { BillFormProvider } from './BillFormProvider';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

import 'style/pages/Bills/PageForm.scss';

function BillFormPage({
  // #withDashboardActions
  setSidebarShrink,
  resetSidebarPreviousExpand,
  setDashboardBackLink
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

  return (
    <BillFormProvider billId={id}>
      <BillForm />
    </BillFormProvider>
  );
}

export default compose(

  withDashboardActions
)(BillFormPage);
