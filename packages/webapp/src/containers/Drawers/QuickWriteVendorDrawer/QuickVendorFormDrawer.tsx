// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';

import { Card, DrawerLoading } from '@/components';
import {
  VendorFormProvider,
  useVendorFormContext,
} from '@/containers/Vendors/VendorForm/VendorFormProvider';
import VendorFormFormik, {
  VendorFormHeaderPrimary,
} from '@/containers/Vendors/VendorForm/VendorFormFormik';

import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';

import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useAddAutofillRef } from '@/hooks/state/autofill';
import { DRAWERS } from '@/constants/drawers';

/**
 * Drawer vendor form loading wrapper.
 * @returns {JSX}
 */
function DrawerVendorFormLoading({ children }) {
  const { isFormLoading } = useVendorFormContext();

  return <DrawerLoading loading={isFormLoading}>{children}</DrawerLoading>;
}

/**
 * Quick vendor form of the drawer.
 */
function QuickVendorFormDrawer({
  displayName,
  closeDrawer,
  vendorId,
  addQuickActionEvent,
  autofillRef,
}) {
  const { payload } = useDrawerContext();
  const addAutofillRef = useAddAutofillRef();

  // Handle the form submit request success.
  const handleSubmitSuccess = (values, form, submitPayload, res) => {
    if (!submitPayload.noRedirect) {
      closeDrawer(DRAWERS.QUICK_WRITE_VENDOR);
    }
    if (autofillRef) {
      addAutofillRef(autofillRef, {
        displayName: values.display_name,
        vendorId: res.id,
      });
    }
  };
  // Handle the form cancel action.
  const handleCancelForm = () => {
    closeDrawer(DRAWERS.QUICK_WRITE_VENDOR);
  };

  return (
    <VendorFormProvider vendorId={vendorId}>
      <DrawerVendorFormLoading>
        <VendorFormCard>
          <VendorFormFormik
            initialValues={{ first_name: displayName }}
            onSubmitSuccess={handleSubmitSuccess}
            onCancel={handleCancelForm}
          />
        </VendorFormCard>
      </DrawerVendorFormLoading>
    </VendorFormProvider>
  );
}

export default R.compose(
  withDrawerActions,
  withDashboardActions,
)(QuickVendorFormDrawer);

const VendorFormCard = styled(Card)`
  margin: 15px;
  padding: 25px;
  margin-bottom: calc(15px + 65px);

  ${VendorFormHeaderPrimary} {
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
