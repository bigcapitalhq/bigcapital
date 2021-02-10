import React from 'react';
import { useParams } from 'react-router-dom';

import { DashboardCard } from 'components';
import CustomerForm from './CustomerForm';
import { CustomerFormProvider } from './CustomerFormProvider';

import 'style/pages/Customers/PageForm.scss';

export default function CustomerFormPage() {
  const { id } = useParams();

  return (
    <CustomerFormProvider customerId={id}>
      <DashboardCard page>
        <CustomerForm />
      </DashboardCard>
    </CustomerFormProvider>
  );
}