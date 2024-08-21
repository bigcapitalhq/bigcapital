// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';

import { Card, DrawerLoading } from '@/components';
import {
  CustomerFormProvider,
  useCustomerFormContext,
} from '@/containers/Customers/CustomerForm/CustomerFormProvider';
import CustomerFormFormik, {
  CustomerFormHeaderPrimary,
} from '@/containers/Customers/CustomerForm/CustomerFormFormik';

import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import { DRAWERS } from '@/constants/drawers';
import { useAddAutofillRef } from '@/hooks/state/autofill';

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
function QuickCustomerFormDrawer({
  displayName,
  autofillRef,
  closeDrawer,
  customerId,
}) {
  const addAutofillRef = useAddAutofillRef();

  // Handle the form submit request success.
  const handleSubmitSuccess = (values, formArgs, submitPayload, res) => {
    if (autofillRef) {
      addAutofillRef(autofillRef, {
        displayName: values.display_name,
        customerId: res.id,
      });
    }
    closeDrawer(DRAWERS.QUICK_CREATE_CUSTOMER);
  };
  // Handle the form cancel action.
  const handleCancelForm = () => {
    closeDrawer(DRAWERS.QUICK_CREATE_CUSTOMER);
  };

  return (
    <CustomerFormProvider customerId={customerId}>
      <DrawerCustomerFormLoading>
        <CustomerFormCard>
          <CustomerFormFormik
            initialValues={{ first_name: displayName }}
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
  padding: 25px;
  margin-bottom: calc(15px + 65px);

  ${CustomerFormHeaderPrimary} {
    padding-top: 0;
  }
  .page-form {
    padding: 0;

    &__floating-actions {
      margin-left: -41px;
      margin-right: -41px;
    }
  }
`;
