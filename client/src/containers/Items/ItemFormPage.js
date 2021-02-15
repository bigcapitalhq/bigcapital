import React from 'react';
import { useParams } from 'react-router-dom';

import { ItemFormProvider } from './ItemFormProvider';
import DashboardCard from 'components/Dashboard/DashboardCard';
import ItemForm from 'containers/Items/ItemForm';

/**
 * Item form page.
 */
export default function ItemFormPage() {
  const { id } = useParams();
 
  return (
    <ItemFormProvider itemId={id}>
      <DashboardCard page>
        <ItemForm />
      </DashboardCard>
    </ItemFormProvider>
  );
}