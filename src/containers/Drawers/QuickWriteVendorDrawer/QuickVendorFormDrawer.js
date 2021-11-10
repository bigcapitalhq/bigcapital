import React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';

import { Card, DrawerLoading } from 'components';

import {
  VendorFormProvider,
  useVendorFormContext,
} from '../../Vendors/VendorForm/VendorFormProvider';
import VendorFormFormik from '../../Vendors/VendorForm/VendorFormFormik';

import withDrawerActions from 'containers/Drawer/withDrawerActions';
import withDashboardActions from '../../Dashboard/withDashboardActions';

import { useDrawerContext } from 'components/Drawer/DrawerProvider';

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
}) {
  const { payload } = useDrawerContext();

  // Handle the form submit request success.
  const handleSubmitSuccess = (values, form, submitPayload, response) => {
    if (!submitPayload.noRedirect) {
      closeDrawer('quick-write-vendor');
    }
    if (payload.quickActionEvent) {
      addQuickActionEvent(payload.quickActionEvent, {
        vendorId: response.data.id,
      });
    }
  };
  // Handle the form cancel action.
  const handleCancelForm = () => {
    closeDrawer('quick-write-vendor');
  };

  return (
    <VendorFormProvider vendorId={vendorId}>
      <DrawerVendorFormLoading>
        <VendorFormCard>
          <VendorFormFormik
            initialValues={{ display_name: displayName }}
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
  margin-bottom: calc(15px + 65px);

  .page-form {
    &__floating-actions {
      margin-left: -36px;
      margin-right: -36px;
    }
  }
`;
