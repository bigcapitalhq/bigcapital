import React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';

import { Card, DrawerLoading } from '@/components';

import {
  CustomerFormProvider,
  useCustomerFormContext,
} from '@/containers/Customers/CustomerForm/CustomerFormProvider';
import CustomerFormFormik from '@/containers/Customers/CustomerForm/CustomerFormFormik';

import withDrawerActions from '@/containers/Drawer/withDrawerActions';

/**
 * Drawer customer form loading wrapper.
 * @returns {JSX}
 */
function DrawerCustomerFormLoading({ children }) {
  const { isFormLoading } = useCustomerFormContext();

  return <DrawerLoading loading={isFormLoading}>{children}</DrawerLoading>;
}

/**
 * Quick customer form of the drawer.
 */
function QuickCustomerFormDrawer({ displayName, closeDrawer, customerId }) {
  // Handle the form submit request success.
  const handleSubmitSuccess = () => {
    closeDrawer('quick-create-customer');
  };
  // Handle the form cancel action.
  const handleCancelForm = () => {
    closeDrawer('quick-create-customer');
  };

  return (
    <CustomerFormProvider customerId={customerId}>
      <DrawerCustomerFormLoading>
        <CustomerFormCard>
          <CustomerFormFormik
            initialValues={{ display_name: displayName }}
            onSubmitSuccess={handleSubmitSuccess}
            onCancel={handleCancelForm}
          />
        </CustomerFormCard>
      </DrawerCustomerFormLoading>
    </CustomerFormProvider>
  );
}

export default R.compose(withDrawerActions)(QuickCustomerFormDrawer);

const CustomerFormCard = styled(Card)`
  margin: 15px;
  margin-bottom: calc(15px + 65px);

  .page-form {
    &__floating-actions {
      margin-left: -36px;
      margin-right: -36px;
    }
  }
`;
