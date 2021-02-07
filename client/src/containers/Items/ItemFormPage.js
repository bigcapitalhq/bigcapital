import React from 'react';
import { useParams } from 'react-router-dom';

import { ItemFormProvider } from './ItemFormProvider';
import DashboardCard from 'components/Dashboard/DashboardCard';
import ItemForm from 'containers/Items/ItemForm';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

/**
 * Item form page.
 */
function ItemFormPage() {
  const { id } = useParams();
 
  return (
    <ItemFormProvider itemId={id}>
      <DashboardCard page>
        <ItemForm />
      </DashboardCard>
    </ItemFormProvider>
  );
}

export default compose(withDashboardActions)(ItemFormPage);
