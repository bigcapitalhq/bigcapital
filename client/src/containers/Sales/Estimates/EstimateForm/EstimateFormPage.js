import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
 
import 'style/pages/SaleEstimate/PageForm.scss';

import EstimateForm from './EstimateForm';
 
import { EstimateFormProvider } from './EstimateFormProvider';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import { compose } from 'utils';

/**
 * Estimate form page.
 */
function EstimateFormPage({
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

 
  return (
    <EstimateFormProvider estimateId={id}>
      <EstimateForm />
    </EstimateFormProvider>
  );
}

export default compose(
 
  withDashboardActions,
)(EstimateFormPage);
