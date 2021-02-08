import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ItemFormProvider } from './ItemFormProvider';
import DashboardCard from 'components/Dashboard/DashboardCard';
import ItemForm from 'containers/Items/ItemForm';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

/**
 * Item form page.
 */
function ItemFormPage({
  // #withDashboardActions
  setDashboardBackLink
}) {
  const { id } = useParams();

  useEffect(() => {
    // Show the back link on dashboard topbar.
    setDashboardBackLink(true);

    return () => {
      // Hide the back link on dashboard topbar.
      setDashboardBackLink(false);
    };
  }, [setDashboardBackLink]);
 
  return (
    <ItemFormProvider itemId={id}>
      <DashboardCard page>
        <ItemForm />
      </DashboardCard>
    </ItemFormProvider>
  );
}

export default compose(
  withDashboardActions,
)(ItemFormPage);
